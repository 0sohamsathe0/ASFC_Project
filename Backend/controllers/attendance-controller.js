import mongoose from "mongoose";

import Attendance from "../models/attendance-model.js";
import Player from "../models/player-model.js";
import {
  getMonthDateRange,
  isValidAttendanceDate,
  isValidAttendanceMonth,
  isValidAttendanceSession,
  isValidAttendanceStatus,
} from "../utils/attendance-validation.js";

const PLAYER_ATTENDANCE_FIELDS = "fullName event photoURL";

const isValidObjectId = (value) => mongoose.isObjectIdOrHexString(value);

const formatPlayer = (player) => ({
  _id: player._id,
  fullName: player.fullName,
  event: player.event,
  photoURL: player.photoURL,
});

const formatAdminAttendance = (record) => ({
  _id: record._id,
  player: record.playerId ? formatPlayer(record.playerId) : null,
  date: record.date,
  session: record.session,
  status: record.status,
  markedBy: record.markedBy,
  markedAt: record.markedAt,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const getMarkingState = async (req, res) => {
  try {
    const { date, session } = req.query;

    if (!isValidAttendanceDate(date)) {
      return res.status(400).json({
        success: false,
        message: "A valid date in YYYY-MM-DD format is required.",
      });
    }

    if (!isValidAttendanceSession(session)) {
      return res.status(400).json({
        success: false,
        message: "Session must be Morning or Evening.",
      });
    }

    const eligiblePlayers = await Player.find({ requestStatus: "Accepted" })
      .select(PLAYER_ATTENDANCE_FIELDS)
      .sort({ fullName: 1 })
      .collation({ locale: "en", strength: 2 })
      .lean();

    const eligiblePlayerIds = eligiblePlayers.map((player) => player._id);
    const existingAttendance = eligiblePlayerIds.length
      ? await Attendance.find({
          date,
          session,
          playerId: { $in: eligiblePlayerIds },
        }).lean()
      : [];

    const attendanceByPlayerId = new Map(
      existingAttendance.map((record) => [record.playerId.toString(), record])
    );

    const remainingPlayers = [];
    const markedPlayers = [];

    eligiblePlayers.forEach((player) => {
      const attendance = attendanceByPlayerId.get(player._id.toString());

      if (!attendance) {
        remainingPlayers.push(formatPlayer(player));
        return;
      }

      markedPlayers.push({
        attendanceId: attendance._id,
        player: formatPlayer(player),
        status: attendance.status,
        markedAt: attendance.markedAt,
      });
    });

    const totalEligible = eligiblePlayers.length;
    const markedCount = markedPlayers.length;
    const remainingCount = remainingPlayers.length;
    const percentage = totalEligible
      ? Math.round((markedCount / totalEligible) * 100)
      : 100;

    return res.status(200).json({
      success: true,
      data: {
        date,
        session,
        totalEligible,
        markedCount,
        remainingCount,
        progress: {
          completed: markedCount,
          total: totalEligible,
          percentage,
        },
        remainingPlayers,
        markedPlayers,
      },
    });
  } catch (error) {
    console.error("Get Attendance Marking State Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while retrieving attendance marking state.",
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { playerId, date, session, status } = req.body;

    if (!isValidObjectId(playerId)) {
      return res.status(400).json({
        success: false,
        message: "A valid playerId is required.",
      });
    }

    if (!isValidAttendanceDate(date)) {
      return res.status(400).json({
        success: false,
        message: "A valid date in YYYY-MM-DD format is required.",
      });
    }

    if (!isValidAttendanceSession(session)) {
      return res.status(400).json({
        success: false,
        message: "Session must be Morning or Evening.",
      });
    }

    if (!isValidAttendanceStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Present or Absent.",
      });
    }

    const player = await Player.findById(playerId)
      .select(`${PLAYER_ATTENDANCE_FIELDS} requestStatus`)
      .lean();

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found.",
      });
    }

    if (player.requestStatus !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only Accepted players are eligible for new attendance.",
      });
    }

    const attendance = await Attendance.create({
      playerId,
      date,
      session,
      status,
      markedBy: String(req.user.id),
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully.",
      data: {
        ...attendance.toObject(),
        player: formatPlayer(player),
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Attendance is already marked for this player, date, and session.",
      });
    }

    console.error("Mark Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while marking attendance.",
    });
  }
};

const getAdminAttendance = async (req, res) => {
  try {
    const { date, session } = req.query;

    if (!isValidAttendanceDate(date)) {
      return res.status(400).json({
        success: false,
        message: "A valid date in YYYY-MM-DD format is required.",
      });
    }

    if (session !== undefined && !isValidAttendanceSession(session)) {
      return res.status(400).json({
        success: false,
        message: "Session must be Morning or Evening.",
      });
    }

    const filter = { date };
    if (session) filter.session = session;

    const attendanceRecords = await Attendance.find(filter)
      .populate("playerId", PLAYER_ATTENDANCE_FIELDS)
      .lean();

    const sessionOrder = { Morning: 0, Evening: 1 };
    attendanceRecords.sort((first, second) => {
      const sessionDifference =
        sessionOrder[first.session] - sessionOrder[second.session];
      if (sessionDifference !== 0) return sessionDifference;

      const firstName = first.playerId?.fullName || "";
      const secondName = second.playerId?.fullName || "";
      return firstName.localeCompare(secondName);
    });

    const summary = {
      Morning: { Present: 0, Absent: 0, Total: 0 },
      Evening: { Present: 0, Absent: 0, Total: 0 },
    };

    attendanceRecords.forEach((record) => {
      summary[record.session][record.status] += 1;
      summary[record.session].Total += 1;
    });

    return res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      summary,
      data: attendanceRecords.map(formatAdminAttendance),
    });
  } catch (error) {
    console.error("Get Admin Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while retrieving attendance.",
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const suppliedFields = Object.keys(req.body);

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid attendance record ID is required.",
      });
    }

    if (
      suppliedFields.length !== 1 ||
      suppliedFields[0] !== "status" ||
      !isValidAttendanceStatus(req.body.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Only status may be updated, and it must be Present or Absent.",
      });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { $set: { status: req.body.status } },
      { returnDocument: "after", runValidators: true }
    )
      .populate("playerId", PLAYER_ATTENDANCE_FIELDS)
      .lean();

    if (!updatedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully.",
      data: formatAdminAttendance(updatedAttendance),
    });
  } catch (error) {
    console.error("Update Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while updating attendance.",
    });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid attendance record ID is required.",
      });
    }

    const deletedAttendance = await Attendance.findByIdAndDelete(id).lean();

    if (!deletedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully.",
      data: { id: deletedAttendance._id },
    });
  } catch (error) {
    console.error("Delete Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while deleting attendance.",
    });
  }
};

const getPlayerAttendance = async (req, res) => {
  try {
    const { month, startDate, endDate } = req.query;

    if (!isValidObjectId(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated player identity.",
      });
    }

    if (month !== undefined && (startDate !== undefined || endDate !== undefined)) {
      return res.status(400).json({
        success: false,
        message: "Use either month or a date range, not both.",
      });
    }

    if (month !== undefined && !isValidAttendanceMonth(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must be a valid value in YYYY-MM format.",
      });
    }

    if (startDate !== undefined && !isValidAttendanceDate(startDate)) {
      return res.status(400).json({
        success: false,
        message: "startDate must be a valid date in YYYY-MM-DD format.",
      });
    }

    if (endDate !== undefined && !isValidAttendanceDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: "endDate must be a valid date in YYYY-MM-DD format.",
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate cannot be after endDate.",
      });
    }

    const filter = { playerId: req.user.id };
    let effectiveStartDate = startDate;
    let effectiveEndDate = endDate;

    if (month) {
      const monthRange = getMonthDateRange(month);
      effectiveStartDate = monthRange.startDate;
      effectiveEndDate = monthRange.endDate;
    }

    if (effectiveStartDate || effectiveEndDate) {
      filter.date = {};
      if (effectiveStartDate) filter.date.$gte = effectiveStartDate;
      if (effectiveEndDate) filter.date.$lte = effectiveEndDate;
    }

    const attendanceRecords = await Attendance.find(filter)
      .select("date session status markedAt createdAt updatedAt")
      .lean();

    const sessionOrder = { Morning: 0, Evening: 1 };
    attendanceRecords.sort((first, second) => {
      const dateDifference = second.date.localeCompare(first.date);
      if (dateDifference !== 0) return dateDifference;
      return sessionOrder[first.session] - sessionOrder[second.session];
    });

    const presentCount = attendanceRecords.filter(
      (record) => record.status === "Present"
    ).length;
    const absentCount = attendanceRecords.length - presentCount;
    const totalSessions = attendanceRecords.length;
    const attendancePercentage = totalSessions
      ? Number(((presentCount / totalSessions) * 100).toFixed(2))
      : 0;

    return res.status(200).json({
      success: true,
      count: totalSessions,
      statistics: {
        totalSessions,
        presentCount,
        absentCount,
        attendancePercentage,
      },
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("Get Player Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while retrieving player attendance.",
    });
  }
};

export {
  deleteAttendance,
  getAdminAttendance,
  getMarkingState,
  getPlayerAttendance,
  markAttendance,
  updateAttendance,
};

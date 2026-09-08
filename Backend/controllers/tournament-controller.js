import TournamentEntry from "../models/tournamentEntry-model.js";
import Tournament from "../models/tournament-model.js"
import Player from "../models/player-model.js"
import { getTournamentScheduleQuery } from "../utils/tournament-dates.js";

const PLAYER_TOURNAMENT_FIELDS =
  "title startingDate endDate locationState locationCity level ageCategory";

const getAllTournaments = async (req, res) => {
  try {
    const { type } = req.query;
    const { filter, sort } = getTournamentScheduleQuery(type);
    const tournaments = await Tournament.find(filter)
      .select(PLAYER_TOURNAMENT_FIELDS)
      .sort(sort)
      .lean();
    res.status(200).json({ "success": true, data: tournaments });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tournaments",
    });
  }
}

const addTournament = async (req, res) => {
  try {
    const {
      title,
      startingDate,
      endDate,
      locationState,
      locationCity,
      level,
      ageCategory
    } = req.body;

    if (!title || !startingDate || !endDate || !locationCity || !level || !ageCategory) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    const existingTournament = await Tournament.findOne({ title })


    if (existingTournament) {
      return res.status(409).json({
        success: false,
        message: "Tournament already exist create tournament with diffrent title",
      });
    }

    const tournament = await Tournament.create({
      title,
      startingDate,
      endDate,
      locationState,
      locationCity,
      level,
      ageCategory
    });

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      tournament
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error while creating tournament",
    });
  }
}

const createEntries = async (req, res) => {
  try {
    const { tournamentId, playerIds } = req.body;

    if (!tournamentId || !playerIds?.length) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID and playerIds are required",
      });
    }

    // 🔹 Fetch players
    const players = await Player.find({
      _id: { $in: playerIds },
    }).select("gender event");

    if (players.length !== playerIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some players not found",
      });
    }

    // 🔹 Fetch existing entries
    const existingEntries = await TournamentEntry.find({
      tournamentId,
    }).populate("playerId", "gender event");


    // 🔥 STEP 1: Remove already existing players
    const existingPlayerIds = existingEntries.map((e) =>
      e.playerId._id.toString()
    );

    const newPlayerIds = playerIds.filter(
      (id) => !existingPlayerIds.includes(id)
    );


    if (newPlayerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All selected players are already registered",
      });
    }
    // 🔹 Get only NEW players data
    const newPlayers = players.filter((p) =>
      newPlayerIds.includes(p._id.toString())
    );

    // 🔹 Combine existing + new players for validation
    const combined = [
      ...existingEntries.map((e) => e.playerId),
      ...newPlayers,
    ];

    // 🔹 Count helpers
    const countBy = (gender, event) =>
      combined.filter(
        (p) => p.gender === gender && p.event === event
      ).length;

    const countGender = (gender) =>
      combined.filter((p) => p.gender === gender).length;

    // 🔥 VALIDATION
    if (countGender("Male") > 12) {
      return res.status(400).json({
        success: false,
        message: "Max 12 boys allowed",
      });
    }

    if (countGender("Female") > 12) {
      return res.status(400).json({
        success: false,
        message: "Max 12 girls allowed",
      });
    }


    const weapons = ["Foil", "Epee", "Sabre"];

    for (let weapon of weapons) {
      if (countBy("Male", weapon) > 4) {
        return res.status(400).json({
          success: false,
          message: `Max 4 Boys ${weapon}`,
        });
      }

      if (countBy("Female", weapon) > 4) {
        return res.status(400).json({
          success: false,
          message: `Max 4 Girls ${weapon}`,
        });
      }
    }


    // 🔹 Prepare entries ONLY for new players
    const entries = newPlayerIds.map((id) => ({
      playerId: id,
      tournamentId,
    }));


    // 🔹 Insert safely
    await TournamentEntry.insertMany(entries);

    res.status(201).json({
      success: true,
      message: "Entries created successfully",
      addedCount: entries.length,
      skippedCount: playerIds.length - entries.length,
    });

  } catch (error) {
    console.error("Create Entries Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {};
    const editableFields = [
      "title", "startingDate", "endDate", "locationState", "locationCity",
      "level", "ageCategory",
    ];
    editableFields.forEach((field) => {
      if (Object.hasOwn(req.body || {}, field)) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    // 🔹 Optional date validation
    if (updateData.startingDate && updateData.endDate) {
      if (new Date(updateData.startingDate) > new Date(updateData.endDate)) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be after end date",
        });
      }
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedTournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tournament updated",
      data: updatedTournament,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getTournamentEntries = async (req, res) => {
  try {
    const { tid } = req.params;

    if (!tid) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID is required",
      });
    }

    const entries = await TournamentEntry.find({ tournamentId: tid })
  .populate(
    "playerId",
    "fullName gender dob event email phone institute aadharCard faiId mfaId"
  );

    res.status(200).json({
      success: true,
      data: entries,
    });

  } catch (error) {
    console.error("Get Entries Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export {
  getAllTournaments, addTournament, createEntries, updateTournament, getTournamentEntries
}

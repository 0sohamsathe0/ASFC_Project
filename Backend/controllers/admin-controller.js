import Player from "../models/player-model.js";
import jwt from "jsonwebtoken";
import { sendAcceptedMail, sendRejectionMail } from "../utils/nodemailer.js";

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token: token,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  }
}

const getPendingPlayers = async (req, res) => {
  try {
    const players = await Player.find({ requestStatus: "Pending" })
      .select("fullName aadharCard aadharCardURL photoURL dob")
      .lean();

    res.status(200).json({
      success: true,
      message: "Pending players retrieved successfully",
      data: players,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const acceptPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = await Player.findById(playerId)
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    await Player.findByIdAndUpdate(playerId, { $set: { requestStatus: "Accepted", isEditable: true, rejectionReson: "" }});

    await sendAcceptedMail(player.fullName, player.email)

    let emailStatus = true;

    try {
      const mailResult = await sendAcceptedMail(
        player.fullName,
        player.email
      );

      if (!mailResult.success) {
        emailStatus = false;
      }

    } catch (mailError) {
      console.error("Email sending failed:", mailError);
      emailStatus = false;
    }

    return res.status(200).json({
      success: true,
      emailSent: emailStatus,
      message: emailStatus
        ? "Player accepted successfully"
        : "Player accepted but email could not be delivered",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const rejectPlayer = async (req, res) => {
  try {
    const { playerId, reason } = req.body;

    const player = await Player.findById(playerId);
if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }
    await Player.findByIdAndUpdate(playerId, { requestStatus: "Rejected", rejectionReason: reason, isEditable: true });

    await sendRejectionMail(player.fullName,player.email,reason)

    res.status(200).json({
      success: true,
      message: "Player rejected successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
//Pending

const makeEveryonePending = async (req, res) => {
  try {
    await Player.updateMany({}, { $set: { requestStatus: 'Pending' } })
    res.status(200).json({
      success: true,
      message: "All player's requestStatus is Pending Now",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error: ${error}`,
    });
  }
}
export { getPendingPlayers, acceptPlayer, rejectPlayer, loginAdmin, makeEveryonePending };

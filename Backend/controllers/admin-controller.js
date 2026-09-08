import Player from "../models/player-model.js";
import jwt from "jsonwebtoken";
import { sendAcceptedMail, sendRejectionMail } from "../utils/emailService.js";
import { acceptPlayerWithFeeAccount } from "../services/fee-account-service.js";
import { FeeServiceError } from "../services/fee-errors.js";

const loginAdmin = async (req, res) => {
  const { username, password } = req.body || {};

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ id: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });


    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: "admin",
        role: "admin"
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  }
}

const verifyAdmin = async (req, res) => {
  res.status(200).json({
    success: true,
    isAuthenticated: true,
  });
}

const getPendingPlayers = async (req, res) => {
  try {
    const players = await Player.find({ requestStatus: "Pending" })
      .select("fullName aadharCard photoURL dob +aadharCardURL +aadharCardPublicId")
      .lean();

    res.status(200).json({
      success: true,
      message: "Pending players retrieved successfully",
      data: players.map(({ aadharCardURL, aadharCardPublicId, ...player }) => ({
        ...player,
        hasAadhaarDocument: Boolean(aadharCardPublicId || aadharCardURL),
      })),
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
    const { billingStartMonth } = req.body || {};
    const player = await acceptPlayerWithFeeAccount({ playerId, billingStartMonth });
    let emailStatus = false;

    try {
      const mailResult = await sendAcceptedMail(
        player.fullName,
        player.email
      );

      if (mailResult.success) {
        emailStatus = true;
      }

    } catch (mailError) {
      console.error("Acceptance email sending failed.");
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
    if (error instanceof FeeServiceError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    }
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

    await Player.findByIdAndUpdate(
      playerId,
      {
        requestStatus: "Rejected",
        rejectionReason: reason,
        isEditable: true,
      }
    );

    let emailStatus = false;

    try {
      const mailResult = await sendRejectionMail(
        player.fullName,
        player.email,
        reason
      );

      if (mailResult?.success) {
        emailStatus = true;
      }
    } catch (mailError) {
      console.error("Rejection email sending failed.");
      emailStatus = false;
    }

    return res.status(200).json({
      success: true,
      emailSent: emailStatus,
      message: emailStatus
        ? "Player rejected successfully and notification email sent."
        : "Player rejected successfully, but notification email could not be delivered.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
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
      message: "Server Error",
    });
  }
}
export { getPendingPlayers, acceptPlayer, rejectPlayer, loginAdmin, verifyAdmin, makeEveryonePending };

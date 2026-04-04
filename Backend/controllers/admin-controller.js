import Player from "../models/player-model.js";
import jwt from "jsonwebtoken";

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  console.log(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

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
    await Player.findByIdAndUpdate(playerId, { $set: {requestStatus: "Accepted"},$unset: { rejectionReason: "" } });
    res.status(200).json({
      success: true,
      message: "Player accepted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const rejectPlayer = async (req, res) => {
  try {
    const { playerId,reason } = req.body;
    await Player.findByIdAndUpdate(playerId, { requestStatus: "Rejected" , rejectionReason : reason});
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

const makeEveryonePending = async(req,res)=>{
  try {
    await Player.updateMany({},{$set: { requestStatus: 'Pending' }})
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
export { getPendingPlayers, acceptPlayer, rejectPlayer,loginAdmin,makeEveryonePending };

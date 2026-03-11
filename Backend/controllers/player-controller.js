import jwt from "jsonwebtoken";
import Player from "../models/player-model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addPlayer = async (req, res) => {
  try {
    const {
      fullName,
      gender,
      dob,
      aadharCardNumber,
      event,
      email,
      phone,
      addressLine1,
      addressLine2,
      pincode,
      institute,
    } = req.body;

    const aadharCard = aadharCardNumber;

    const address = {
      addressLine1,
      addressLine2,
      pincode,
    };

    const photo = req.files?.photo ? req.files.photo[0].path : null;
    const aadharCardPhoto = req.files?.aadharCardPhoto ? req.files.aadharCardPhoto[0].path : null;

    if (!photo || !aadharCardPhoto) {
      return res.status(400).json({
        success: false,
        message: "Photo and Aadhaar card images are required",
      });
    }

    // ✅ Basic validation
    if (
      !fullName ||
      !gender ||
      !dob ||
      !aadharCard ||
      !event ||
      !email ||
      !phone ||
      !address ||
      !institute
    ) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingPlayer = await Player.findOne({ aadharCard });

    if (existingPlayer) {
      return res.status(409).json({
        success: false,
        message: "Player already registered with this Aadhaar",
      });
    }

    //upload files to cloudinary and get URLs
    const photoURL = await uploadOnCloudinary(photo);
    const aadharCardURL = await uploadOnCloudinary(aadharCardPhoto);

    console.log("Cloudinary URLs: ", photoURL, aadharCardURL);

    // ✅ Create new player
    const newPlayer = await Player.create({
      fullName,
      gender,
      dob,
      aadharCard,
      event,
      email,
      phone,
      address,
      institute,
      photoURL,
      aadharCardURL,
    });

    res.status(201).json({
      success: true,
      message: "Player added successfully",
      data: newPlayer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getPlayers = async (req, res) => {
  try {
    // optional query filter
    const { status } = req.query;

    // build filter object
    let filter = {};

    if (status) {
      filter.requestStatus = status;
    }

    // fetch players
    const players = await Player.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: players.length,
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

const loginPlayer = async (req, res) => {
  try {
    const { aadharCard, dob } = req.body;

    const player = await Player.findOne({ aadharCard });


    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    //doning this to ignore time part of date and compare only date
    //also form send dob as string so converting it to date object and then to string again to compare with db value
    const inputDob = new Date(dob).toISOString().split("T")[0];
    const dbDob = player.dob.toISOString().split("T")[0];

    if (inputDob !== dbDob) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: player._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getPlayerProfile = async (req, res) => {
  const player = await Player.findById(req.playerId);

  res.json({
    success: true,
    player,
  });
};

const logoutPlayer = async (req, res) => {
  res.clearCookie("playerToken");
  res.json({
    success: true,
    message: "Logout successful",
  });
};

export { addPlayer, getPlayers, loginPlayer, getPlayerProfile, logoutPlayer };

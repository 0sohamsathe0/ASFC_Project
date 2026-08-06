import jwt from "jsonwebtoken";
import Player from "../models/player-model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const addPlayer = async (req, res) => {
  let photoUpload = null;
  let aadhaarUpload = null;

  try {
    const fullName = req.body.fullName?.trim();
    const gender = req.body.gender?.trim();
    const dob = req.body.dob?.trim();
    const faiId = req.body.faiId?.trim();
    const mfaId = req.body.mfaId?.trim();

    const aadharCard = req.body.aadharCard
      ?.replace(/\s+/g, "")
      .trim();

    const event = req.body.event?.trim();

    const email = req.body.email
      ?.trim()
      .toLowerCase();

    const phone = req.body.phone
      ?.replace(/\s+/g, "")
      .trim();

    const addressLine1 = req.body.addressLine1?.trim();
    const addressLine2 = req.body.addressLine2?.trim();
    const pincode = req.body.pincode?.trim();
    const institute = req.body.institute?.trim();

    const address = {
      addressLine1,
      addressLine2,
      pincode,
    };

    const photo = req.files?.photo?.[0]?.path;
    const aadharCardPhoto = req.files?.aadharCardPhoto?.[0]?.path;

    if (!photo || !aadharCardPhoto) {
      return res.status(400).json({
        success: false,
        message: "Photo and Aadhaar card images are required.",
      });
    }

    if (!faiId || !mfaId) {
      return res.status(400).json({
        success: false,
        message: "FAI ID and MFA ID are required.",
      });
    }

    if (
      !fullName ||
      !gender ||
      !dob ||
      !aadharCard ||
      !event ||
      !email ||
      !phone ||
      !addressLine1 ||
      !pincode ||
      !institute
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const existingPlayer = await Player.findOne({ aadharCard });

    if (existingPlayer) {
      return res.status(409).json({
        success: false,
        message: "Player already registered with this Aadhaar.",
      });
    }

    // Upload player photo
    photoUpload = await uploadOnCloudinary(photo);

    // Upload Aadhaar
    try {
      aadhaarUpload = await uploadOnCloudinary(aadharCardPhoto);
    } catch (error) {
      await deleteFromCloudinary(photoUpload.public_id);

      return res.status(503).json({
        success: false,
        message:
          "We're unable to upload your documents at the moment. Please try again later.",
      });
    }

    let newPlayer;

    try {
      newPlayer = await Player.create({
        fullName,
        gender,
        dob,
        aadharCard,
        event,
        email,
        phone,
        address,
        institute,
        photoURL: photoUpload.secure_url,
        aadharCardURL: aadhaarUpload.secure_url,
        faiId,
        mfaId,
      });
    } catch (dbError) {
      await Promise.all([
        deleteFromCloudinary(photoUpload.public_id),
        deleteFromCloudinary(aadhaarUpload.public_id),
      ]);

      throw dbError;
    }

    const token = jwt.sign(
      {
        id: newPlayer._id,
        role: "player",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Player added successfully.",
      user: {
        id: newPlayer._id,
        role: "player",
      },
    });
  } catch (error) {
    console.error("Player Registration Error:", error);

    // Cleanup uploaded files (if any)
    await Promise.all([
      deleteFromCloudinary(photoUpload?.public_id),
      deleteFromCloudinary(aadhaarUpload?.public_id),
    ]);

    // Cloudinary / External service error
    if (error.http_code || error.name === "Error") {
      return res.status(503).json({
        success: false,
        message:
          "We're unable to upload your documents at the moment. Please try again later.",
      });
    }

    // Unexpected server error
    return res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
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
    } else {
      const players = await Player.find().lean();

      const grouped = {
        Accepted: [],
        Rejected: [],
        Pending: []
      };

      players.forEach(player => {
        if (grouped[player.requestStatus]) {
          grouped[player.requestStatus].push(player);
        }
      });
      let count = (grouped["Accepted"].length) + (grouped["Rejected"].length) + (grouped["Pending"].length)
      return res.status(200).json({
        success: true,
        count,
        data: grouped,
      });
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
    console.log(aadharCard, dob)

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

    const token = jwt.sign({ id: player._id, role: "player" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Player Login Successful",
      user: {
        role: "player",
      },
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
  try {
    const player = await Player.findById(req.user.id);
    res.json({
      success: true,
      player,
    });
  }
  catch (err) {
    res.json({
      success: false,
      Error: err.message,
    });
  }
};

const logoutPlayer = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};


const updatePlayer = async (req, res) => {
  try {
    const playerId = req.params.pid;
    const data = req.body;
    const updates = {};
    const restrictedFields = ["_id", "password", "requestStatus", "role", "isAdmin", "createdAt", "updatedAt",];


    for (let key in data) {
      if (restrictedFields.includes(key)) continue;

      if (
        typeof data[key] === "object" &&
        data[key] !== null &&
        !Array.isArray(data[key])
      ) {
        for (let subKey in data[key]) {
          updates[`${key}.${subKey}`] = data[key][subKey];
        }
      } else {
        updates[key] = data[key];
      }
    }

    // Prevent empty update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    console.log(updates)
    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedPlayer) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Player updated successfully",
      data: updatedPlayer,
    });
  } catch (error) {
    console.error("Update error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};

export { addPlayer, getPlayers, loginPlayer, getPlayerProfile, logoutPlayer, updatePlayer };

import jwt from "jsonwebtoken";
import Player from "../models/player-model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { normalizeAssociationRegistration } from "../utils/association-registration.js";

const addPlayer = async (req, res) => {
  let photoUpload = null;
  let aadhaarUpload = null;
  const startTime = Date.now();
console.log("[REGISTER] Start");

  try {
    const fullName = req.body.fullName?.trim();
    const gender = req.body.gender?.trim();
    const dob = req.body.dob?.trim();
    const associationRegistration = normalizeAssociationRegistration(req.body);

    if (associationRegistration.error) {
      return res.status(400).json({
        success: false,
        message: associationRegistration.error,
      });
    }

    const {
      faiId,
      mfaId,
      hasFaiRegistration,
      hasMfaRegistration,
    } = associationRegistration.value;

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

    const cloudinaryStart = Date.now();
    // Upload player photo
    // Upload both documents to Cloudinary in parallel
    const [photoResult, aadhaarResult] = await Promise.allSettled([
      uploadOnCloudinary(photo),
      uploadOnCloudinary(aadharCardPhoto),
    ]);

    // Store successful uploads for cleanup / database use
    if (photoResult.status === "fulfilled") {
      photoUpload = photoResult.value;
    }

    if (aadhaarResult.status === "fulfilled") {
      aadhaarUpload = aadhaarResult.value;
    }

    // If either upload failed, clean up the successful upload
    if (
      photoResult.status === "rejected" ||
      aadhaarResult.status === "rejected"
    ) {
      await Promise.all([
        deleteFromCloudinary(photoUpload?.public_id),
        deleteFromCloudinary(aadhaarUpload?.public_id),
      ]);

      return res.status(503).json({
        success: false,
        message:
          "We're unable to upload your documents at the moment. Please try again later.",
      });
    }

    console.log(
  `[REGISTER] Cloudinary uploads: ${Date.now() - cloudinaryStart}ms`
);

const dbStart = Date.now();


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
        hasFaiRegistration,
        hasMfaRegistration,
      });
    } catch (dbError) {
      await Promise.all([
        deleteFromCloudinary(photoUpload.public_id),
        deleteFromCloudinary(aadhaarUpload.public_id),
      ]);

      throw dbError;
    }
console.log(
  `[REGISTER] MongoDB create: ${Date.now() - dbStart}ms`
);
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
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
     console.log(
  `[REGISTER] Total: ${Date.now() - startTime}ms`
);

    return res.status(201).json({
      success: true,
      message: "Player added successfully.",
      user: {
        id: newPlayer._id,
        fullName: newPlayer.fullName,
        event: newPlayer.event,
        requestStatus: newPlayer.requestStatus,
        rejectionReason: newPlayer.rejectionReason,
        hasFaiRegistration: newPlayer.hasFaiRegistration,
        hasMfaRegistration: newPlayer.hasMfaRegistration,
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
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Player Login Successful",
      user: {
        id: player._id,
        role: "player",
        fullName: player.fullName,
        event: player.event,
        requestStatus: player.requestStatus,
        rejectionReason: player.rejectionReason,
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
    const player = await Player.findById(req.user.id)
      .select(
        "fullName gender dob event email phone address institute photoURL aadharCardURL faiId mfaId hasFaiRegistration hasMfaRegistration requestStatus rejectionReason isEditable createdAt updatedAt"
      )
      .lean();

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      player,
    });
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve player profile",
    });
  }
};

const logoutPlayer = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
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
    const restrictedFields = ["_id", "password", "role", "isAdmin", "createdAt", "updatedAt",];


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

const PLAYER_EDITABLE_FIELDS = [
  "fullName",
  "gender",
  "dob",
  "event",
  "email",
  "phone",
  "institute",
];
const PLAYER_EDITABLE_ADDRESS_FIELDS = [
  "addressLine1",
  "addressLine2",
  "pincode",
];

const updateOwnPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.user.id)
      .select("requestStatus isEditable")
      .lean();

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    if (player.requestStatus !== "Rejected" || !player.isEditable) {
      return res.status(403).json({
        success: false,
        message: "Profile correction is not currently available.",
      });
    }

    const submittedData = req.body || {};
    const updates = {};
    PLAYER_EDITABLE_FIELDS.forEach((field) => {
      if (Object.hasOwn(submittedData, field)) updates[field] = submittedData[field];
    });

    const submittedAddress = submittedData.address;
    if (
      submittedAddress &&
      typeof submittedAddress === "object" &&
      !Array.isArray(submittedAddress)
    ) {
      PLAYER_EDITABLE_ADDRESS_FIELDS.forEach((field) => {
        if (Object.hasOwn(submittedAddress, field)) {
          updates[`address.${field}`] = submittedAddress[field];
        }
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile changes were submitted.",
      });
    }

    updates.requestStatus = "Pending";
    updates.rejectionReason = "";
    updates.isEditable = false;

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    ).select(
      "fullName gender dob event email phone address institute photoURL aadharCardURL faiId mfaId hasFaiRegistration hasMfaRegistration requestStatus rejectionReason isEditable"
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated and sent for review.",
      data: updatedPlayer,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Player self-update error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    });
  }
};

export {
  addPlayer,
  getPlayers,
  loginPlayer,
  getPlayerProfile,
  logoutPlayer,
  updateOwnPlayer,
  updatePlayer,
};

import jwt from "jsonwebtoken";
import Player from "../models/player-model.js";
import {
  createPrivateAadhaarAccessUrl,
  deleteFromCloudinary,
  uploadOnCloudinary,
  uploadPrivateAadhaar,
} from "../utils/cloudinary.js";
import { normalizeAssociationRegistration } from "../utils/association-registration.js";
import { cleanupUploadedFiles } from "../middlewares/multer-middleware.js";

const AADHAAR_STORAGE_SELECT = "+aadharCardURL +aadharCardPublicId +aadharCardResourceType +aadharCardFormat";

const registrationServices = {
  uploadPhoto: uploadOnCloudinary,
  uploadAadhaar: uploadPrivateAadhaar,
  deleteAsset: deleteFromCloudinary,
};

const toPlayerDto = (player) => {
  const object = player?.toObject ? player.toObject() : { ...player };
  const {
    aadharCardURL,
    aadharCardPublicId,
    aadharCardResourceType,
    aadharCardFormat,
    ...safePlayer
  } = object;
  return {
    ...safePlayer,
    hasAadhaarDocument: Boolean(aadharCardPublicId || aadharCardURL),
  };
};

const isValidLoginDob = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
};

const sendAadhaarDocumentAccess = async (playerId, res) => {
  const player = await Player.findById(playerId)
    .select(AADHAAR_STORAGE_SELECT)
    .lean();
  if (!player) {
    return res.status(404).json({ success: false, message: "Player not found." });
  }
  if (!player.aadharCardPublicId) {
    if (player.aadharCardURL) {
      return res.status(409).json({
        success: false,
        message: "This legacy document must be migrated before secure viewing is available.",
        code: "AADHAAR_DOCUMENT_MIGRATION_REQUIRED",
      });
    }
    return res.status(404).json({ success: false, message: "Aadhaar document not found." });
  }

  const access = createPrivateAadhaarAccessUrl({
    publicId: player.aadharCardPublicId,
    resourceType: player.aadharCardResourceType,
    format: player.aadharCardFormat,
  });
  res.set("Cache-Control", "no-store, private");
  return res.status(200).json({
    success: true,
    data: {
      url: access.url,
      expiresAt: new Date(access.expiresAt * 1000).toISOString(),
      format: player.aadharCardFormat,
    },
  });
};

const addPlayer = async (req, res) => {
  let photoUpload = null;
  let aadhaarUpload = null;

  try {
    const body = req.body || {};
    const stringField = (value) => typeof value === "string" ? value.trim() : "";
    const fullName = stringField(body.fullName);
    const gender = stringField(body.gender);
    const dob = stringField(body.dob);
    const associationRegistration = normalizeAssociationRegistration(body);

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

    const aadharCard = typeof body.aadharCard === "string"
      ? body.aadharCard.replace(/\s+/g, "").trim()
      : "";

    const event = stringField(body.event);

    const email = stringField(body.email).toLowerCase();

    const phone = typeof body.phone === "string"
      ? body.phone.replace(/\s+/g, "").trim()
      : "";

    const addressLine1 = stringField(body.addressLine1);
    const addressLine2 = stringField(body.addressLine2);
    const pincode = stringField(body.pincode);
    const institute = stringField(body.institute);

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

    if (
      !/^\d{12}$/.test(aadharCard) ||
      !isValidLoginDob(dob) ||
      !/^\d{10}$/.test(phone) ||
      !/^\d{6}$/.test(pincode)
    ) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar, date of birth, phone number, or pincode is invalid.",
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
    // Upload both documents to Cloudinary in parallel
    const [photoResult, aadhaarResult] = await Promise.allSettled([
      registrationServices.uploadPhoto(photo),
      registrationServices.uploadAadhaar(aadharCardPhoto),
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
        registrationServices.deleteAsset(photoUpload?.public_id),
        registrationServices.deleteAsset(aadhaarUpload?.public_id, {
          resourceType: aadhaarUpload?.resource_type,
          type: "authenticated",
        }),
      ]);

      return res.status(503).json({
        success: false,
        message:
          "We're unable to upload your documents at the moment. Please try again later.",
      });
    }

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
        photoURL: photoUpload.secure_url,
        aadharCardPublicId: aadhaarUpload.public_id,
        aadharCardResourceType: aadhaarUpload.resource_type,
        aadharCardFormat: aadhaarUpload.format,
        faiId,
        mfaId,
        hasFaiRegistration,
        hasMfaRegistration,
      });
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
    console.error("Player registration failed.");

    // Cleanup uploaded files (if any)
    await Promise.all([
      registrationServices.deleteAsset(photoUpload?.public_id),
      registrationServices.deleteAsset(aadhaarUpload?.public_id, {
        resourceType: aadhaarUpload?.resource_type,
        type: "authenticated",
      }),
    ]);

    // Cloudinary / external service error
    if (error.http_code) {
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
  } finally {
    await cleanupUploadedFiles(req.files);
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
      const players = await Player.find().select(AADHAAR_STORAGE_SELECT).lean();

      const grouped = {
        Accepted: [],
        Rejected: [],
        Pending: []
      };

      players.forEach(player => {
        if (grouped[player.requestStatus]) {
          grouped[player.requestStatus].push(toPlayerDto(player));
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
    const players = await Player.find(filter)
      .select(AADHAAR_STORAGE_SELECT)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: players.length,
      data: players.map(toPlayerDto),
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
    const { aadharCard, dob } = req.body || {};

    if (typeof aadharCard !== "string" || !/^\d{12}$/.test(aadharCard) || !isValidLoginDob(dob)) {
      return res.status(400).json({
        success: false,
        message: "A valid 12-digit Aadhaar number and date of birth are required.",
      });
    }

    const player = await Player.findOne({ aadharCard });

    if (!player) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //doning this to ignore time part of date and compare only date
    //also form send dob as string so converting it to date object and then to string again to compare with db value
    const inputDob = dob;
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
        `fullName gender dob event email phone address institute photoURL faiId mfaId hasFaiRegistration hasMfaRegistration requestStatus rejectionReason isEditable createdAt updatedAt ${AADHAAR_STORAGE_SELECT}`
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
      player: toPlayerDto(player),
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

const getOwnAadhaarDocument = async (req, res) => {
  try {
    return await sendAadhaarDocumentAccess(req.user.id, res);
  } catch (error) {
    console.error("Unable to create protected Aadhaar access.");
    return res.status(500).json({ success: false, message: "Unable to access the document." });
  }
};

const getAdminAadhaarDocument = async (req, res) => {
  try {
    return await sendAadhaarDocumentAccess(req.params.playerId, res);
  } catch (error) {
    if (error?.name === "CastError") {
      return res.status(400).json({ success: false, message: "A valid player ID is required." });
    }
    console.error("Unable to create protected Aadhaar access.");
    return res.status(500).json({ success: false, message: "Unable to access the document." });
  }
};


const updatePlayer = async (req, res) => {
  try {
    const playerId = req.params.pid;
    const data = req.body;
    const updates = {};
    const editableFields = [
      "fullName", "gender", "dob", "aadharCard", "event", "email", "phone",
      "institute", "faiId", "mfaId", "hasFaiRegistration", "hasMfaRegistration",
    ];
    const editableAddressFields = ["addressLine1", "addressLine2", "pincode"];

    editableFields.forEach((field) => {
      if (Object.hasOwn(data || {}, field)) updates[field] = data[field];
    });
    if (data?.address && typeof data.address === "object" && !Array.isArray(data.address)) {
      editableAddressFields.forEach((field) => {
        if (Object.hasOwn(data.address, field)) updates[`address.${field}`] = data.address[field];
      });
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
    ).select(AADHAAR_STORAGE_SELECT);

    if (!updatedPlayer) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Player updated successfully",
      data: toPlayerDto(updatedPlayer),
    });
  } catch (error) {
    console.error("Player update failed.");

    return res.status(500).json({
      success: false,
      message: "Unable to update player.",
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
      `fullName gender dob event email phone address institute photoURL faiId mfaId hasFaiRegistration hasMfaRegistration requestStatus rejectionReason isEditable ${AADHAAR_STORAGE_SELECT}`
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated and sent for review.",
      data: toPlayerDto(updatedPlayer),
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Submitted profile data is invalid.",
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
  getAdminAadhaarDocument,
  getOwnAadhaarDocument,
  getPlayers,
  loginPlayer,
  getPlayerProfile,
  logoutPlayer,
  updateOwnPlayer,
  updatePlayer,
  registrationServices,
};

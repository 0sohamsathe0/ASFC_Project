import express from "express";
import Player from "../models/player-model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addPlayer = async (req, res) => {
  try {
    const {
      fullName,
      gender,
      dob,
      aadharCard,
      event,
      email,
      phone,
      addressLine1,
      addressLine2,
      pincode,
      institute,
    } = req.body;

    const address = {
      addressLine1,
      addressLine2,
      pincode,
    };

    const photo = req.files?.photo ? req.files.photo[0].path : null;
    const aadharCardPhoto = req.files?.aadharCardPhoto
      ? req.files.aadharCardPhoto[0].path
      : null;

      console.log("Received data: ", photo, aadharCardPhoto)

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
      !email ||
      !phone ||
      !address ||
      !address.addressLine1 ||
      !address.pincode ||
      !institute
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }
    console.log("Basic validation passed")
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

    console.log("Cloudinary URLs: ", photoURL, aadharCardURL)

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

export { addPlayer, getPlayers };

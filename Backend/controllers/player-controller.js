import express from "express";
import Player from "../models/player-model.js";

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
      address,
      institute,
      photoURL,
      aadharCardURL,
    } = req.body;

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
      !institute ||
      !photoURL ||
      !aadharCardURL
    ) {
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
    const players = await Player.find(filter)
      .sort({ createdAt: -1 }); 

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

export { addPlayer , getPlayers };
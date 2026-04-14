import TournamentEntry from "../models/tournamentEntry-model.js";
import Tournament from "../models/tournament-model.js"
import Player from "../models/player-model.js"

const getAllTournaments = async (req, res) => {
    try {

        const { type } = req.query;

        const today = new Date();

        let filter = {};

        if (type === "upcoming") {
            filter.startingDate = { $gt: today };
        }

        else if (type === "ongoing") {
            filter.startingDate = { $lte: today };
            filter.endDate = { $gte: today };
        }

        else if (type === "history") {
            filter.endDate = { $lt: today };
        }

        const tournaments = await Tournament.find(filter).sort({
            startingDate: 1
        });

        res.status(200).json({"success":true,data:tournaments});

    } catch (error) {
        res.status(500).json({
            message: "Error fetching tournaments",
            error
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

        console.log(title,
            startingDate,
            endDate,
            locationState,
            locationCity,
            level,
            ageCategory)

        if (!title || !startingDate || !endDate || !locationCity || !locationCity || !level || !ageCategory) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingTournament = await Tournament.findOne({ title })


        if (existingTournament) {
            return res.status(409).json({
                success: false,
                message: "Tournament already already exist create tournamement with diffrent title",
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
            error: error.message
        });
    }
}

const createEntries = async (req, res) => {
   
    {/*
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
  _id: { $in: playerIds }
}).select("gender event");

    if (players.length !== playerIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some players not found",
      });
    }

    // 🔹 Existing entries
    const existingEntries = await TournamentEntry.find({
      tournamentId,
    }).populate("playerId");

    // 🔹 Combine existing + new players
    const combined = [...existingEntries.map(e => e.playerId), ...players];

    // 🔹 Count helpers
    const countBy = (gender, event) =>
      combined.filter(
        (p) => p.gender === gender && p.event === event
      ).length;

    const countGender = (gender) =>
      combined.filter((p) => p.gender === gender).length;

    // 🔹 VALIDATION (only max limits)
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

    // 🔹 Prepare entries
    const entries = playerIds.map((id) => ({
      playerId: id,
      tournamentId,
    }));

    // 🔹 Insert (skip duplicates safely)
    await TournamentEntry.insertMany(entries, { ordered: false });

    res.status(201).json({
      success: true,
      message: "Entries created successfully",
    });

  } catch (error) {
    console.error("Create Entries Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
     */}
};

const updateTournament = async (req, res) => {
   const { id } = req.params;

    const updateData = { ...req.body };
    console.log(id,updateData);
     
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

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
        new: true,
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

export {
    getAllTournaments, addTournament, createEntries,updateTournament
}
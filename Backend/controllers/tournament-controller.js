import Tournament from "../models/tournament-model.js";

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

    res.json(tournaments);

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

export {
    getAllTournaments, addTournament
}
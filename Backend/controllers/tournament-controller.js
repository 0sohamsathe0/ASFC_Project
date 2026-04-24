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
      _id: { $in: playerIds },
    }).select("gender event");

    if (players.length !== playerIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some players not found",
      });
    }

    // 🔹 Fetch existing entries
    const existingEntries = await TournamentEntry.find({
      tournamentId,
    }).populate("playerId", "gender event");

    console.log("players fetched , tournament fetched",existingEntries,players)

    // 🔥 STEP 1: Remove already existing players
    const existingPlayerIds = existingEntries.map((e) =>
      e.playerId._id.toString()
    );
    console.log("existing player map is done");
    
    const newPlayerIds = playerIds.filter(
      (id) => !existingPlayerIds.includes(id)
    );
    console.log("removing existing is done");
    

    console.log(newPlayerIds)
    if (newPlayerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All selected players are already registered",
      });
    }
    console.log("Reached herrrrre")
    // 🔹 Get only NEW players data
    const newPlayers = players.filter((p) =>
      newPlayerIds.includes(p._id.toString())
    );

    // 🔹 Combine existing + new players for validation
    const combined = [
      ...existingEntries.map((e) => e.playerId),
      ...newPlayers,
    ];

    // 🔹 Count helpers
    const countBy = (gender, event) =>
      combined.filter(
        (p) => p.gender === gender && p.event === event
      ).length;

    const countGender = (gender) =>
      combined.filter((p) => p.gender === gender).length;

    // 🔥 VALIDATION
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

    console.log("gender validation okkk")

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

    console.log("Event wise validation is okkk")

    // 🔹 Prepare entries ONLY for new players
    const entries = newPlayerIds.map((id) => ({
      playerId: id,
      tournamentId,
    }));

    console.log("my entries object : ",entries)

    // 🔹 Insert safely
    await TournamentEntry.insertMany(entries);

    res.status(201).json({
      success: true,
      message: "Entries created successfully",
      addedCount: entries.length,
      skippedCount: playerIds.length - entries.length,
    });

  } catch (error) {
    console.error("Create Entries Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
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
        returnDocument: "after",
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


const getTournamentEntries = async (req, res) => {
  try {
    const { tid } = req.params;
    console.log(tid);
    
    if (!tid) {
      return res.status(400).json({
        success: false,
        message: "Tournament ID is required",
      });
    }

    const entries = await TournamentEntry.find({ tournamentId: tid  })
      .populate("playerId", "fullName gender event");

    res.status(200).json({
      success: true,
      data: entries,
    });

  } catch (error) {
    console.error("Get Entries Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export {
    getAllTournaments, addTournament, createEntries,updateTournament,getTournamentEntries
}
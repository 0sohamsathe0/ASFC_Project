import IndividualResult from "../models/individual-result-model.js"
import TeamResult from "../models/team-result-model.js";

const getIndividualResult = async (req, res) => {
    try {
        const { tournamentId } = req.params;

        const results = await IndividualResult.find({ tournamentId })
            .populate({
                path: "tournamentEntryId",
                populate: {
                    path: "playerId", // if exists in TournamentEntry
                },
            });

        return res.status(200).json({
            success: true,
            data: results,
        });
    } catch (err) {
        console.error("Get Result Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}
const getTeamResult = async (req, res) => {
    try {
        const { tournamentId } = req.params;

        if (!tournamentId) {
            return res.status(400).json({
                message: "Tournament ID required",
            });
        }

        const results = await TeamResult.find({ tournamentId })
            .lean(); // faster

        res.status(200).json({
            message: "Team results fetched",
            data: results,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
        });
    }
}

const addIndividualResult = async (req, res) => {
    try {
        const results = req.body; // array

        if (!Array.isArray(results)) {
            return res.status(400).json({
                success: false,
                message: "Payload must be an array",
            });
        }

        const insertedResults = [];

        for (const item of results) {
            const {
                tournamentId,
                tournamentEntryId,
                playerId,
                place,
                category,
            } = item;

            // skip empty object
            if (!tournamentEntryId || !place || !category) continue;

            try {
                // 🔥 upsert (update if exists, else create)
                const result = await IndividualResult.findOneAndUpdate(
                    { tournamentEntryId },   // 🔥 change here
                    {
                        tournamentId,
                        category,
                        place,
                        tournamentEntryId,
                    },
                    { upsert: true, returnDocument: "after" }
                );

                insertedResults.push(result);
            } catch (err) {
                // duplicate place error
                if (err.code === 11000) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate position ${place} in ${category}`,
                    });
                }
                throw err;
            }
        }

        return res.status(201).json({
            success: true,
            message: "Results saved successfully",
            data: insertedResults,
        });
    } catch (err) {
        console.error("Add Result Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

const addTeamResult = async (req, res) => {
    try {
        const { tournamentId, category, place, players } = req.body;

        // Validation
        if (!tournamentId || !category || !place) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (!players || players.length === 0) {
            return res.status(400).json({
                message: "At least one player required"
            });
        }

        // Check duplicate
        const existing = await TeamResult.findOne({
            tournamentId,
            category
        });

        if (existing) {
            return res.status(400).json({
                message: "Result already declared for this category"
            });
        }

        // Format players
        const formattedPlayers = players.map((p) => ({
            playerId: p.playerId || null,
            entryId: p.entryId || null,
            name: p.name
        }));

        // Insert
        const result = await TeamResult.create({
            tournamentId,
            category,
            place,
            players: formattedPlayers
        });

        res.status(201).json({
            message: "Team result added",
            data: result
        });
    } catch (err) {
        console.error(err);

        // Handle duplicate index error
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Result already exists"
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
}

export {
    getIndividualResult, addIndividualResult, getTeamResult, addTeamResult
}
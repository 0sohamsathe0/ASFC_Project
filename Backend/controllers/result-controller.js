import IndividualResult from "../models/individual-result-model.js"
import TeamResult from "../models/team-result-model.js";
import TournamentEntry from "../models/tournamentEntry-model.js";
import Player from "../models/player-model.js"


//getting tournament wise result 
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

//getting player wise result 
const getPlayerIndividualResults = async (req, res) => {
    try {
        const { playerId } = req.params;

        // Find all tournament entries of this player
        const entries = await TournamentEntry.find({ playerId })
            .select("_id")
            .lean();

        if (entries.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }

        const entryIds = entries.map(entry => entry._id);

        // Find all results of those entries
        const results = await IndividualResult.find({
            tournamentEntryId: { $in: entryIds },
        })
            .populate({
                path: "tournamentEntryId",
                populate: {
                    path: "playerId",
                },
            })
            .populate("tournamentId")
            .lean();

        const formattedResults = results.map((item) => ({
            _id: item._id,

            player: {
                fullName: item.tournamentEntryId.playerId.fullName,
                institute: item.tournamentEntryId.playerId.institute,
                event: item.tournamentEntryId.playerId.event,
                photoURL: item.tournamentEntryId.playerId.photoURL,
            },

            tournament: {
                title: item.tournamentId.title,
                startingDate: item.tournamentId.startingDate,
                endDate: item.tournamentId.endDate,
                locationCity: item.tournamentId.locationCity,
                locationState: item.tournamentId.locationState,
                level: item.tournamentId.level,
                ageCategory: item.tournamentId.ageCategory,
            },

            result: {
                place: item.place,
                category: item.category,
                certificateType: "Individual"
            },
        }));

        return res.status(200).json({
            success: true,
            data: formattedResults,
        });
    } catch (err) {
        console.error("Get Player Individual Results Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getPlayerTeamResults = async (req, res) => {
    try {
        const { playerId } = req.params;

        const results = await TeamResult.find({
            "players.playerId": playerId,
        })
            .populate("tournamentId")
            .populate("players.playerId")
            .lean();

        const formattedResults = results.map((item) => {
            // Find the logged-in player's record in the team
            const currentPlayer = item.players.find(
                (player) => player.playerId?._id.toString() === playerId
            );

            return {
                _id: item._id,

                player: {
                    fullName: currentPlayer?.playerId?.fullName || currentPlayer?.name,
                    institute: currentPlayer?.playerId?.institute || "",
                    event: currentPlayer?.playerId?.event || "",
                    photoURL: currentPlayer?.playerId?.photoURL || "",
                },

                tournament: {
                    title: item.tournamentId.title,
                    startingDate: item.tournamentId.startingDate,
                    endDate: item.tournamentId.endDate,
                    locationCity: item.tournamentId.locationCity,
                    locationState: item.tournamentId.locationState,
                    level: item.tournamentId.level,
                    ageCategory: item.tournamentId.ageCategory,
                },

                result: {
                    place: item.place,
                    category: item.category,
                    certificateType: "Team"
                },
            };
        });

        return res.status(200).json({
            success: true,
            data: formattedResults,
        });
    } catch (err) {
        console.error("Get Player Team Results Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


//Adding result 
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

//result 
const levelOrder = {
    International: 0,
    National: 1,
    State: 2,
    District: 3,
};

const getClubResults = async (req, res) => {
    try {
        // ================= FETCH DATA =================

        const registeredPlayers = await Player.countDocuments();

        const individualResults = await IndividualResult.find()
            .populate("tournamentId")
            .populate({
                path: "tournamentEntryId",
                populate: {
                    path: "playerId",
                },
            })
            .lean();

        const teamResults = await TeamResult.find()
            .populate("tournamentId")
            .populate("players.playerId")
            .lean();

        // ================= ANALYTICS =================

        const analytics = {
            registeredPlayers,

            totalMedals: 0,

            internationalMedals: 0,
            nationalMedals: 0,
            stateMedals: 0,
            districtMedals: 0,
        };

        const incrementMedalCount = (level) => {
            analytics.totalMedals++;

            switch (level) {
                case "International":
                    analytics.internationalMedals++;
                    break;

                case "National":
                    analytics.nationalMedals++;
                    break;

                case "State":
                    analytics.stateMedals++;
                    break;

                case "District":
                    analytics.districtMedals++;
                    break;

                default:
                    break;
            }
        };

        // ================= TOURNAMENT MAP =================

        const tournamentMap = new Map();

        const getTournamentObject = (tournament) => {
            const tournamentId = tournament._id.toString();

            if (!tournamentMap.has(tournamentId)) {
                tournamentMap.set(tournamentId, {
                    _id: tournament._id,
                    title: tournament.title,
                    locationCity: tournament.locationCity,
                    locationState: tournament.locationState,
                    startingDate: tournament.startingDate,
                    endDate: tournament.endDate,
                    level: tournament.level,
                    totalMedals: 0,

                    achievements: {
                        team: [],
                        individual: [],
                    },
                });
            }

            return tournamentMap.get(tournamentId);
        };

        // ================= INDIVIDUAL RESULTS =================

        for (const result of individualResults) {
            const player = result.tournamentEntryId?.playerId;
            const tournament = result.tournamentId;

            if (!player || !tournament) continue;

            const tournamentData = getTournamentObject(tournament);

            tournamentData.achievements.individual.push({
                name: player.fullName,
                medal: result.place,
                category: result.category,
            });

            tournamentData.totalMedals++;

            incrementMedalCount(tournament.level);
        }

        // ================= TEAM RESULTS =================

        for (const result of teamResults) {
            const tournament = result.tournamentId;

            if (!tournament) continue;

            const clubPlayers = result.players
                .filter((player) => player.playerId)
                .map((player) => player.playerId.fullName);

            if (clubPlayers.length === 0) continue;

            const tournamentData = getTournamentObject(tournament);

            tournamentData.achievements.team.push({
                category: result.category,
                medal: result.place,
                players: clubPlayers,
            });

            tournamentData.totalMedals++;

            incrementMedalCount(tournament.level);
        }

        // ================= GROUP BY LEVEL =================

        const groupedResults = {};

        for (const tournament of tournamentMap.values()) {
            if (!groupedResults[tournament.level]) {
                groupedResults[tournament.level] = [];
            }

            groupedResults[tournament.level].push(tournament);
        }

        // ================= SORT TOURNAMENTS =================

        Object.values(groupedResults).forEach((tournaments) => {
            tournaments.sort(
                (a, b) => new Date(b.startingDate) - new Date(a.startingDate)
            );
        });

        // ================= FORMAT RESPONSE =================

        const data = Object.entries(groupedResults)
            .sort(([a], [b]) => levelOrder[a] - levelOrder[b])
            .map(([level, tournaments]) => ({
                level,
                tournaments,
            }));

        // ================= RESPONSE =================

        return res.status(200).json({
            success: true,
            analytics,
            data,
        });
    } catch (err) {
        console.error("Get Club Results Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


export {
    getIndividualResult, addIndividualResult, getTeamResult, addTeamResult, getPlayerIndividualResults, getPlayerTeamResults,
    getClubResults
}
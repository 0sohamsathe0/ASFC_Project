import IndividualResult from "../models/individual-result-model.js"

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
    res.status(200).json({
        success: true,
        result: "data of Team result"
    })
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

}

export {
    getIndividualResult, addIndividualResult, getTeamResult, addTeamResult
}
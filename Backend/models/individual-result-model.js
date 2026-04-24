import mongoose, { Types } from "mongoose";
import TournamentEntry from "./tournamentEntry-model.js";

const individualResultSchema = mongoose.Schema({
  tournamentEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TournamentEntry",
    required: true,
  },

  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  place: {
    type: String,
    enum: ["First", "Second", "Third"],
    required: true,
  },
});

// ✅ Rule 1 → Unique position per category
individualResultSchema.index(
  { tournamentId: 1, category: 1, place: 1 },
  { unique: true }
);

// ✅ Rule 2 → One result per entry
individualResultSchema.index(
  { tournamentEntryId: 1 },
  { unique: true }
);

const IndividualResult = mongoose.model("IndividualResult",individualResultSchema);
export default IndividualResult;

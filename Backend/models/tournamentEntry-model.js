import mongoose from "mongoose";

const tournamentEntrySchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    status: {
      type: String,
      enum: ["Selected", "Submitted"],
      default: "Selected",
    },
}, { timestamps: true }
);

const TournamentEntry = mongoose.model("TournamentEntry", tournamentEntrySchema);
export default TournamentEntry
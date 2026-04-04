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
}, { timestamps: true }
);
export default mongoose.model("TournamentEntry", tournamentEntrySchema);
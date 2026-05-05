import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    default: null
  },
  entryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TournamentEntry",
    default: null
  },
  name: {
    type: String,
    required: true
  }
});

const teamResultSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true
    },

    category: {
      type: String,
      required: true
    },

    place: {
      type: String,
      enum: ["First", "Second", "Third"],
      required: true
    },

    players: {
      type: [playerSchema],
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "At least one player required"
      }
    }
  },
  { timestamps: true }
);

// 🔥 UNIQUE constraint (VERY IMPORTANT)
teamResultSchema.index(
  { tournamentId: 1, category: 1, place: 1 },
  { unique: true }
);
const TeamResult = mongoose.model("TeamResult", teamResultSchema);
export default TeamResult
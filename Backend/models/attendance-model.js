import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
    },

    session: {
      type: String,
      enum: ["Morning", "Evening"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },

    markedBy: {
      type: String, // Stores req.user.id from JWT (player ObjectId string or "admin")
      required: true,
    },

    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Compound unique index to prevent duplicate attendance records
// for the same player on the same date and session
// Also supports queries on: playerId, playerId+date
attendanceSchema.index(
  { playerId: 1, date: 1, session: 1 },
  { unique: true }
);

// Compound index for date + session queries
// Also supports queries on: date
attendanceSchema.index({ date: 1, session: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
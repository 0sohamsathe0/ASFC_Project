import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    aadharCard: {
      type: String,
      required: true,
      unique: true,
      length: 12,
    },

    event: {
      required: true,
      type: String,
      enum: ["Epee", "Foil", "Sabre"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },

    address: {
      addressLine1: {
        type: String,
        required: true,
        maxlength: 200,
      },

      addressLine2: {
        type: String,
        maxlength: 200,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    institute: {
      type: String,
      required: true,
      maxlength: 150,
    },

    photoURL: {
      type: String,
      required: true,
    },

    aadharCardURL: {
      type: String,
      required: true,
    },

    //for admin approval process
    requestStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Player = mongoose.model("Player", playerSchema);


export default Player;
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
      default: "",
      select: false,
    },
    aadharCardPublicId: {
      type: String,
      default: "",
      select: false,
    },
    aadharCardResourceType: {
      type: String,
      enum: ["image", "raw"],
      default: "image",
      select: false,
    },
    aadharCardFormat: {
      type: String,
      default: "",
      select: false,
    },
    // models/Player.js

    faiId: {
      type: String,
      default: "",
      trim: true,
      required() {
        return this.hasFaiRegistration;
      },
    },

    hasFaiRegistration: {
      type: Boolean,
      default: true,
    },

    mfaId: {
      type: String,
      default: "",
      trim: true,
      required() {
        return this.hasMfaRegistration;
      },
    },

    hasMfaRegistration: {
      type: Boolean,
      default: true,
    },

    //for admin approval process
    requestStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
      default: ""
    },
    isEditable: { type: Boolean, default: false },
  },
  { timestamps: true },
);

playerSchema.pre("validate", function normalizeAssociationIds() {
  if (this.hasFaiRegistration === false) {
    this.faiId = "";
  }

  if (this.hasMfaRegistration === false) {
    this.mfaId = "";
  }
});

const Player = mongoose.model("Player", playerSchema);


export default Player;

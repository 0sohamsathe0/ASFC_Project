import mongoose from "mongoose";

import { compareMonths, isValidFeeMonth } from "../utils/fee-month.js";
import { isNullableFeeMonth } from "../utils/fee-validation.js";

const feePauseSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      immutable: true,
    },
    startMonth: {
      type: String,
      required: true,
      immutable: true,
      validate: {
        validator: isValidFeeMonth,
        message: "startMonth must use valid YYYY-MM format.",
      },
    },
    endMonth: {
      type: String,
      default: null,
      validate: {
        validator: isNullableFeeMonth,
        message: "endMonth must be null or use valid YYYY-MM format.",
      },
    },
  },
  { timestamps: true }
);

feePauseSchema.pre("validate", function validatePauseRange() {
  if (
    isValidFeeMonth(this.startMonth) &&
    isValidFeeMonth(this.endMonth) &&
    compareMonths(this.endMonth, this.startMonth) < 0
  ) {
    this.invalidate("endMonth", "endMonth cannot precede startMonth.");
  }
});

feePauseSchema.index({ playerId: 1, startMonth: 1 }, { unique: true });
feePauseSchema.index({ playerId: 1, startMonth: 1, endMonth: 1 });
feePauseSchema.index(
  { playerId: 1 },
  {
    unique: true,
    partialFilterExpression: { endMonth: { $type: "null" } },
    name: "one_open_pause_per_player",
  }
);

const FeePause = mongoose.model("FeePause", feePauseSchema);
export default FeePause;

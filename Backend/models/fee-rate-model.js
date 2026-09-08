import mongoose from "mongoose";

import { isValidFeeMonth } from "../utils/fee-month.js";
import { isSafePositiveInteger } from "../utils/fee-validation.js";

const feeRateSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      immutable: true,
      validate: {
        validator: isSafePositiveInteger,
        message: "amount must be a positive safe integer.",
      },
    },
    effectiveFromMonth: {
      type: String,
      required: true,
      immutable: true,
      validate: {
        validator: isValidFeeMonth,
        message: "effectiveFromMonth must use valid YYYY-MM format.",
      },
    },
  },
  { timestamps: true }
);

feeRateSchema.index({ effectiveFromMonth: 1 }, { unique: true });

const FeeRate = mongoose.model("FeeRate", feeRateSchema);
export default FeeRate;

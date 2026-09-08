import mongoose from "mongoose";

import { compareMonths, isValidFeeMonth } from "../utils/fee-month.js";
import {
  isNullableFeeMonth,
  isSafeNonNegativeInteger,
} from "../utils/fee-validation.js";

const feeAccountSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      immutable: true,
    },
    billingStartMonth: {
      type: String,
      required: true,
      immutable: true,
      validate: {
        validator: isValidFeeMonth,
        message: "billingStartMonth must use valid YYYY-MM format.",
      },
    },
    paidThroughMonth: {
      type: String,
      default: null,
      validate: {
        validator: isNullableFeeMonth,
        message: "paidThroughMonth must be null or use valid YYYY-MM format.",
      },
    },
    totalPaid: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: isSafeNonNegativeInteger,
        message: "totalPaid must be a non-negative safe integer.",
      },
    },
    closedFromMonth: {
      type: String,
      default: null,
      validate: {
        validator: isNullableFeeMonth,
        message: "closedFromMonth must be null or use valid YYYY-MM format.",
      },
    },
  },
  { timestamps: true }
);

feeAccountSchema.pre("validate", function validateCoveragePosition() {
  if (this.paidThroughMonth === null && this.totalPaid !== 0) {
    this.invalidate("totalPaid", "totalPaid must be zero when paidThroughMonth is null.");
  }
  if (this.paidThroughMonth !== null && this.totalPaid <= 0) {
    this.invalidate("totalPaid", "totalPaid must be positive when paidThroughMonth is set.");
  }
  if (
    isValidFeeMonth(this.paidThroughMonth) &&
    isValidFeeMonth(this.billingStartMonth) &&
    compareMonths(this.paidThroughMonth, this.billingStartMonth) < 0
  ) {
    this.invalidate("paidThroughMonth", "paidThroughMonth cannot precede billingStartMonth.");
  }
  if (
    isValidFeeMonth(this.closedFromMonth) &&
    isValidFeeMonth(this.billingStartMonth) &&
    compareMonths(this.closedFromMonth, this.billingStartMonth) < 0
  ) {
    this.invalidate("closedFromMonth", "closedFromMonth cannot precede billingStartMonth.");
  }
  if (
    isValidFeeMonth(this.closedFromMonth) &&
    isValidFeeMonth(this.paidThroughMonth) &&
    compareMonths(this.closedFromMonth, this.paidThroughMonth) <= 0
  ) {
    this.invalidate("closedFromMonth", "closedFromMonth must be after paidThroughMonth.");
  }
});

feeAccountSchema.index({ playerId: 1 }, { unique: true });
feeAccountSchema.index({ closedFromMonth: 1 });
feeAccountSchema.index({ paidThroughMonth: 1 });

const FeeAccount = mongoose.model("FeeAccount", feeAccountSchema);
export default FeeAccount;

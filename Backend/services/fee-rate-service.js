import {
  FEE_DIGITAL_START_MONTH,
  INITIAL_MONTHLY_FEE,
} from "../config/fee-config.js";
import FeeRate from "../models/fee-rate-model.js";
import { compareMonths, getCurrentClubMonth, isValidFeeMonth } from "../utils/fee-month.js";
import { isSafePositiveInteger } from "../utils/fee-validation.js";
import { FeeServiceError, isDuplicateKeyError } from "./fee-errors.js";

const listFeeRates = () => FeeRate.find().sort({ effectiveFromMonth: 1 }).lean();

const ensureInitialFeeRate = async () => {
  const existing = await FeeRate.findOne({
    effectiveFromMonth: FEE_DIGITAL_START_MONTH,
  }).lean();
  if (existing) {
    if (existing.amount !== INITIAL_MONTHLY_FEE) {
      throw new Error("The initial fee rate conflicts with the approved configuration.");
    }
    return existing;
  }

  try {
    return await FeeRate.create({
      amount: INITIAL_MONTHLY_FEE,
      effectiveFromMonth: FEE_DIGITAL_START_MONTH,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const concurrent = await FeeRate.findOne({
        effectiveFromMonth: FEE_DIGITAL_START_MONTH,
      }).lean();
      if (concurrent?.amount === INITIAL_MONTHLY_FEE) return concurrent;
    }
    throw error;
  }
};

const addFeeRate = async ({ amount, effectiveFromMonth }, { allowInitialRate = false } = {}) => {
  if (!isSafePositiveInteger(amount)) {
    throw new FeeServiceError("amount must be a positive safe integer.", {
      status: 400,
      code: "INVALID_FEE_RATE_AMOUNT",
    });
  }
  if (!isValidFeeMonth(effectiveFromMonth)) {
    throw new FeeServiceError("effectiveFromMonth must use valid YYYY-MM format.", {
      status: 400,
      code: "INVALID_FEE_MONTH",
    });
  }

  const currentMonth = getCurrentClubMonth();
  const isInitialDigitalRate =
    allowInitialRate && effectiveFromMonth === FEE_DIGITAL_START_MONTH;
  if (!isInitialDigitalRate && compareMonths(effectiveFromMonth, currentMonth) <= 0) {
    throw new FeeServiceError("A new fee rate must be effective from a future month.", {
      code: "FEE_RATE_NOT_FUTURE",
    });
  }

  try {
    return await FeeRate.create({ amount, effectiveFromMonth });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new FeeServiceError("A fee rate already starts in this month.", {
        status: 409,
        code: "FEE_RATE_ALREADY_EXISTS",
      });
    }
    throw error;
  }
};

export { addFeeRate, ensureInitialFeeRate, listFeeRates };

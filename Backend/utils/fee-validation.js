import { FEE_DIGITAL_START_MONTH } from "../config/fee-config.js";
import { compareMonths, getCurrentClubMonth, isValidFeeMonth } from "./fee-month.js";

const isSafeNonNegativeInteger = (value) =>
  Number.isSafeInteger(value) && value >= 0;

const isSafePositiveInteger = (value) =>
  Number.isSafeInteger(value) && value > 0;

const isNullableFeeMonth = (value) => value === null || isValidFeeMonth(value);

const validateBillingStartMonth = (value, currentMonth = getCurrentClubMonth()) => {
  if (!isValidFeeMonth(value)) {
    return { valid: false, message: "billingStartMonth must use valid YYYY-MM format." };
  }
  if (compareMonths(value, FEE_DIGITAL_START_MONTH) < 0) {
    return {
      valid: false,
      message: `billingStartMonth cannot be earlier than ${FEE_DIGITAL_START_MONTH}.`,
    };
  }
  if (compareMonths(value, currentMonth) > 0) {
    return { valid: false, message: "billingStartMonth cannot be later than the current month." };
  }
  return { valid: true };
};

export {
  isNullableFeeMonth,
  isSafeNonNegativeInteger,
  isSafePositiveInteger,
  validateBillingStartMonth,
};

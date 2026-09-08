import {
  CLUB_TIME_ZONE,
  FEE_FINANCIAL_YEAR_START_MONTH,
} from "../config/fee-config.js";

const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

const parseFeeMonth = (value) => {
  if (typeof value !== "string") return null;

  const match = value.match(MONTH_PATTERN);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (year < 1 || year > 9999 || month < 1 || month > 12) return null;

  return { year, month };
};

const isValidFeeMonth = (value) => parseFeeMonth(value) !== null;

const toMonthOrdinal = (value) => {
  const parsed = parseFeeMonth(value);
  if (!parsed) throw new TypeError("Month must use valid YYYY-MM format.");
  return parsed.year * 12 + parsed.month - 1;
};

const fromMonthOrdinal = (ordinal) => {
  if (!Number.isInteger(ordinal) || ordinal < 12 || ordinal > 119999) {
    throw new RangeError("Month ordinal is outside the supported range.");
  }

  const year = Math.floor(ordinal / 12);
  const month = (ordinal % 12) + 1;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
};

const compareMonths = (first, second) =>
  Math.sign(toMonthOrdinal(first) - toMonthOrdinal(second));

const addMonths = (value, count) => {
  if (!Number.isInteger(count)) throw new TypeError("Month offset must be an integer.");
  return fromMonthOrdinal(toMonthOrdinal(value) + count);
};

const previousMonth = (value) => addMonths(value, -1);

const iterateMonths = (startMonth, endMonth) => {
  const start = toMonthOrdinal(startMonth);
  const end = toMonthOrdinal(endMonth);
  if (start > end) return [];

  return Array.from({ length: end - start + 1 }, (_, index) =>
    fromMonthOrdinal(start + index)
  );
};

const getCurrentClubMonth = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: CLUB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}`;
};

const getFinancialYearRange = (startYear) => {
  const year = Number(startYear);
  if (!Number.isInteger(year) || year < 1 || year > 9998) return null;

  const startMonth = `${String(year).padStart(4, "0")}-${String(
    FEE_FINANCIAL_YEAR_START_MONTH
  ).padStart(2, "0")}`;
  return {
    startMonth,
    endMonth: addMonths(startMonth, 11),
    label: `${year}-${String(year + 1).slice(-2)}`,
  };
};

const isMonthInRange = (month, startMonth, endMonth = null) =>
  compareMonths(month, startMonth) >= 0 &&
  (endMonth === null || compareMonths(month, endMonth) <= 0);

export {
  addMonths,
  compareMonths,
  getCurrentClubMonth,
  getFinancialYearRange,
  isMonthInRange,
  isValidFeeMonth,
  iterateMonths,
  parseFeeMonth,
  previousMonth,
};

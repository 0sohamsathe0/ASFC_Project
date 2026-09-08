const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const formatCurrency = (amount) =>
  Number.isFinite(Number(amount)) ? currencyFormatter.format(Number(amount)) : "—";

export const formatFeeMonth = (month, fallback = "Not yet covered") => {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || "")) return fallback;
  const [year, monthNumber] = month.split("-").map(Number);
  return monthFormatter.format(new Date(Date.UTC(year, monthNumber - 1, 1)));
};

export const getCurrentIndiaMonth = () => {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}`;
};

export const addFeeMonths = (month, amount) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const value = year * 12 + monthNumber - 1 + amount;
  return `${Math.floor(value / 12)}-${String((value % 12) + 1).padStart(2, "0")}`;
};

export const getFinancialYearStart = (month = getCurrentIndiaMonth()) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return monthNumber >= 6 ? year : year - 1;
};

export const formatFinancialYear = (startYear) =>
  `June ${startYear} – May ${Number(startYear) + 1}`;

export const groupMonthsByFinancialYear = (months = []) =>
  months.reduce((groups, entry) => {
    const startYear = getFinancialYearStart(entry.month);
    const key = String(startYear);
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
    return groups;
  }, {});

export const getFeeErrorMessage = (error, fallback = "Unable to complete this fee action.") => {
  const code = error.response?.data?.code;
  const messages = {
    FEE_ACCOUNT_CONFLICT: "The fee account changed. Refreshing the latest information.",
    FEE_PAUSE_CONFLICT: "The fee pause changed. Refreshing the latest information.",
    FUTURE_PREPAID_LIMIT_EXCEEDED: "Coverage can include no more than 12 future payable months.",
    COVERAGE_BLOCKED_BY_OPEN_PAUSE: "Reactivate the open pause before recording later coverage.",
    COVERAGE_BLOCKED_BY_CLOSURE: "Coverage cannot extend into the closed account period.",
    FEE_RATE_NOT_FOUND: "A monthly fee rate is missing for one or more selected months.",
    FEE_ACCOUNT_ALREADY_EXISTS: "This player already has a fee account.",
    FEE_RATE_ALREADY_EXISTS: "A fee rate already starts in that month.",
    INVALID_FEE_SEARCH: "Enter one player name of up to 100 characters.",
  };
  return messages[code] || error.response?.data?.message || fallback;
};

export const isFeeConflict = (error) =>
  error.response?.status === 409 &&
  ["FEE_ACCOUNT_CONFLICT", "FEE_PAUSE_CONFLICT"].includes(error.response?.data?.code);

export const feeStateLabel = (entry) => {
  if (entry.status === "closed") return "Closed";
  if (entry.status === "paused") return "Paused";
  if (entry.coverageState === "futurePrepaid") return "Future prepaid";
  if (entry.coverageState === "pending") return "Pending";
  if (entry.coverageState === "covered") return "Covered";
  return "Not payable";
};

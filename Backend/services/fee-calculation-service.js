import { MAX_ADVANCE_PAYABLE_MONTHS } from "../config/fee-config.js";
import {
  addMonths,
  compareMonths,
  getCurrentClubMonth,
  isMonthInRange,
  iterateMonths,
} from "../utils/fee-month.js";
import { FeeServiceError } from "./fee-errors.js";

const sortByStartMonth = (records, field) =>
  [...records].sort((first, second) => compareMonths(first[field], second[field]));

const findPauseForMonth = (pauses, month) =>
  pauses.find((pause) => isMonthInRange(month, pause.startMonth, pause.endMonth));

const getStatusForMonth = (account, pauses, month) => {
  if (
    account.closedFromMonth &&
    compareMonths(month, account.closedFromMonth) >= 0
  ) {
    return "closed";
  }
  return findPauseForMonth(pauses, month) ? "paused" : "active";
};

const findApplicableRate = (rates, month) => {
  let applicableRate = null;
  for (const rate of rates) {
    if (compareMonths(rate.effectiveFromMonth, month) > 0) break;
    applicableRate = rate;
  }
  return applicableRate;
};

const requireApplicableRate = (rates, month) => {
  const rate = findApplicableRate(rates, month);
  if (!rate) {
    throw new FeeServiceError(`No fee rate applies to ${month}.`, {
      code: "FEE_RATE_NOT_FOUND",
      details: { month },
    });
  }
  return rate;
};

const getCoverageState = (account, status, month, asOfMonth) => {
  if (status !== "active") return "notApplicable";
  if (
    account.paidThroughMonth &&
    compareMonths(month, account.paidThroughMonth) <= 0
  ) {
    return compareMonths(month, asOfMonth) > 0 ? "futurePrepaid" : "covered";
  }
  return compareMonths(month, asOfMonth) <= 0 ? "pending" : "futureUnpaid";
};

const findNextUnpaidPayableMonth = (account, pauses) => {
  let month = account.paidThroughMonth
    ? addMonths(account.paidThroughMonth, 1)
    : account.billingStartMonth;
  const sortedPauses = sortByStartMonth(pauses, "startMonth");

  for (let guard = 0; guard < 12000; guard += 1) {
    if (
      account.closedFromMonth &&
      compareMonths(month, account.closedFromMonth) >= 0
    ) {
      return { month: null, blockedReason: "CLOSED" };
    }

    const pause = findPauseForMonth(sortedPauses, month);
    if (!pause) return { month, blockedReason: null };
    if (pause.endMonth === null) {
      return { month: null, blockedReason: "OPEN_PAUSE" };
    }
    month = addMonths(pause.endMonth, 1);
  }

  throw new FeeServiceError("Unable to determine the next payable month.", {
    status: 500,
    code: "FEE_MONTH_ITERATION_LIMIT",
  });
};

const countFuturePrepaidPayableMonths = (
  account,
  pauses,
  paidThroughMonth = account.paidThroughMonth,
  asOfMonth = getCurrentClubMonth()
) => {
  if (!paidThroughMonth || compareMonths(paidThroughMonth, asOfMonth) <= 0) return 0;

  const startMonth = addMonths(asOfMonth, 1);
  const sortedPauses = sortByStartMonth(pauses, "startMonth");
  return iterateMonths(startMonth, paidThroughMonth).filter(
    (month) =>
      compareMonths(month, account.billingStartMonth) >= 0 &&
      getStatusForMonth(account, sortedPauses, month) === "active"
  ).length;
};

const selectNextPayableMonths = (
  account,
  pauses,
  numberOfMonths,
  { asOfMonth = getCurrentClubMonth() } = {}
) => {
  if (
    !Number.isInteger(numberOfMonths) ||
    numberOfMonths < 1 ||
    numberOfMonths > MAX_ADVANCE_PAYABLE_MONTHS
  ) {
    throw new FeeServiceError(
      `numberOfMonths must be between 1 and ${MAX_ADVANCE_PAYABLE_MONTHS}.`,
      { status: 400, code: "INVALID_COVERAGE_MONTH_COUNT" }
    );
  }

  const sortedPauses = sortByStartMonth(pauses, "startMonth");
  let month = account.paidThroughMonth
    ? addMonths(account.paidThroughMonth, 1)
    : account.billingStartMonth;
  const payableMonths = [];
  const skippedPausedMonths = [];

  for (let guard = 0; guard < 12000 && payableMonths.length < numberOfMonths; guard += 1) {
    if (
      account.closedFromMonth &&
      compareMonths(month, account.closedFromMonth) >= 0
    ) {
      throw new FeeServiceError("Coverage cannot extend into a closed account period.", {
        code: "COVERAGE_BLOCKED_BY_CLOSURE",
        details: { payableMonths, skippedPausedMonths },
      });
    }

    const pause = findPauseForMonth(sortedPauses, month);
    if (pause) {
      if (pause.endMonth === null) {
        throw new FeeServiceError(
          "Reactivate the account from an explicit month before recording further coverage.",
          {
            code: "COVERAGE_BLOCKED_BY_OPEN_PAUSE",
            details: { payableMonths, skippedPausedMonths },
          }
        );
      }
      skippedPausedMonths.push(...iterateMonths(month, pause.endMonth));
      month = addMonths(pause.endMonth, 1);
      continue;
    }

    payableMonths.push(month);
    month = addMonths(month, 1);
  }

  if (payableMonths.length !== numberOfMonths) {
    throw new FeeServiceError("Unable to select the requested payable months.", {
      code: "COVERAGE_SELECTION_INCOMPLETE",
    });
  }

  const existingFuturePrepaidMonths = countFuturePrepaidPayableMonths(
    account,
    sortedPauses,
    account.paidThroughMonth,
    asOfMonth
  );
  const resultingFuturePrepaidMonths = countFuturePrepaidPayableMonths(
    account,
    sortedPauses,
    payableMonths.at(-1),
    asOfMonth
  );
  if (resultingFuturePrepaidMonths > MAX_ADVANCE_PAYABLE_MONTHS) {
    throw new FeeServiceError(
      `Coverage may include at most ${MAX_ADVANCE_PAYABLE_MONTHS} future prepaid payable months.`,
      {
        code: "FUTURE_PREPAID_LIMIT_EXCEEDED",
        details: {
          maximumFuturePrepaidMonths: MAX_ADVANCE_PAYABLE_MONTHS,
          existingFuturePrepaidMonths,
          requestedAdditionalFutureMonths:
            resultingFuturePrepaidMonths - existingFuturePrepaidMonths,
          resultingFuturePrepaidMonths,
          asOfMonth,
        },
      }
    );
  }

  return { payableMonths, skippedPausedMonths };
};

const calculateCoverageAmount = (payableMonths, rates) => {
  const sortedRates = sortByStartMonth(rates, "effectiveFromMonth");
  const monthAmounts = payableMonths.map((month) => {
    const rate = requireApplicableRate(sortedRates, month);
    return { month, amount: rate.amount, rateEffectiveFromMonth: rate.effectiveFromMonth };
  });
  return {
    monthAmounts,
    totalAmount: monthAmounts.reduce((total, entry) => total + entry.amount, 0),
  };
};

const calculateFeeView = ({
  account,
  pauses = [],
  rates = [],
  asOfMonth = getCurrentClubMonth(),
  viewStartMonth,
  viewEndMonth,
}) => {
  const sortedPauses = sortByStartMonth(pauses, "startMonth");
  const sortedRates = sortByStartMonth(rates, "effectiveFromMonth");
  const defaultEnd =
    account.paidThroughMonth && compareMonths(account.paidThroughMonth, asOfMonth) > 0
      ? account.paidThroughMonth
      : asOfMonth;
  const requestedStart = viewStartMonth || account.billingStartMonth;
  const startMonth = compareMonths(requestedStart, account.billingStartMonth) < 0
    ? account.billingStartMonth
    : requestedStart;
  const endMonth = viewEndMonth || defaultEnd;
  const months = compareMonths(startMonth, endMonth) <= 0
    ? iterateMonths(startMonth, endMonth).map((month) => {
        const status = getStatusForMonth(account, sortedPauses, month);
        const payable = status === "active";
        const coverageState = getCoverageState(account, status, month, asOfMonth);
        const rate = payable ? requireApplicableRate(sortedRates, month) : null;
        return {
          month,
          status,
          payable,
          coverageState,
          scheduledRate: rate?.amount ?? null,
          rateEffectiveFromMonth: rate?.effectiveFromMonth ?? null,
        };
      })
    : [];

  const coveredMonths = months
    .filter((entry) => entry.coverageState === "covered")
    .map((entry) => entry.month);
  const pendingMonths = months
    .filter((entry) => entry.coverageState === "pending")
    .map((entry) => entry.month);
  const pausedMonths = months
    .filter((entry) => entry.status === "paused")
    .map((entry) => entry.month);
  const futurePrepaidMonths = months
    .filter((entry) => entry.coverageState === "futurePrepaid")
    .map((entry) => entry.month);
  const currentOutstanding = months
    .filter((entry) => entry.coverageState === "pending")
    .reduce((total, entry) => total + entry.scheduledRate, 0);
  const nextPayable = findNextUnpaidPayableMonth(account, sortedPauses);

  return {
    asOfMonth,
    currentStatus: getStatusForMonth(account, sortedPauses, asOfMonth),
    coveredMonths,
    pendingMonths,
    pausedMonths,
    futurePrepaidMonths,
    nextUnpaidPayableMonth: nextPayable.month,
    coverageBlockedReason: nextPayable.blockedReason,
    recordedPaid: account.totalPaid,
    currentOutstanding,
    totalExpectedFees: account.totalPaid + currentOutstanding,
    months,
  };
};

export {
  calculateCoverageAmount,
  calculateFeeView,
  countFuturePrepaidPayableMonths,
  findApplicableRate,
  findNextUnpaidPayableMonth,
  findPauseForMonth,
  getStatusForMonth,
  requireApplicableRate,
  selectNextPayableMonths,
};

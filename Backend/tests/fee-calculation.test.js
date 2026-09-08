import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateCoverageAmount,
  calculateFeeView,
  findApplicableRate,
  selectNextPayableMonths,
} from "../services/fee-calculation-service.js";

const account = {
  billingStartMonth: "2026-06",
  paidThroughMonth: "2026-09",
  totalPaid: 6000,
  closedFromMonth: null,
};
const rates = [
  { amount: 1500, effectiveFromMonth: "2026-06" },
  { amount: 1700, effectiveFromMonth: "2027-06" },
];

test("finds the latest rate effective for a month", () => {
  assert.equal(findApplicableRate(rates, "2027-05").amount, 1500);
  assert.equal(findApplicableRate(rates, "2027-06").amount, 1700);
  assert.equal(findApplicableRate(rates, "2026-05"), null);
});

test("calculates pending months and outstanding through the current month", () => {
  const view = calculateFeeView({ account, rates, asOfMonth: "2026-11" });
  assert.deepEqual(view.pendingMonths, ["2026-10", "2026-11"]);
  assert.equal(view.currentOutstanding, 3000);
  assert.equal(view.totalExpectedFees, 9000);
  assert.equal(view.currentStatus, "active");
});

test("a financial-year view never charges months before the player billing start", () => {
  const lateJoiner = {
    ...account,
    billingStartMonth: "2026-10",
    paidThroughMonth: null,
    totalPaid: 0,
  };
  const view = calculateFeeView({
    account: lateJoiner,
    rates,
    asOfMonth: "2026-11",
    viewStartMonth: "2026-06",
    viewEndMonth: "2027-05",
  });
  assert.equal(view.months[0].month, "2026-10");
  assert.deepEqual(view.pendingMonths, ["2026-10", "2026-11"]);
});

test("future open pause does not change current status and blocks at its start", () => {
  const pauses = [{ startMonth: "2026-12", endMonth: null }];
  const view = calculateFeeView({ account, pauses, rates, asOfMonth: "2026-09" });
  assert.equal(view.currentStatus, "active");
  assert.equal(view.nextUnpaidPayableMonth, "2026-10");
  assert.deepEqual(selectNextPayableMonths(account, pauses, 2).payableMonths, [
    "2026-10",
    "2026-11",
  ]);
  assert.throws(
    () => selectNextPayableMonths(account, pauses, 3),
    (error) => error.code === "COVERAGE_BLOCKED_BY_OPEN_PAUSE"
  );
});

test("reactivated bounded pause is skipped without consuming payable month count", () => {
  const pauses = [{ startMonth: "2026-10", endMonth: "2026-12" }];
  assert.deepEqual(selectNextPayableMonths(account, pauses, 2), {
    payableMonths: ["2027-01", "2027-02"],
    skippedPausedMonths: ["2026-10", "2026-11", "2026-12"],
  });
});

test("open pause in effect has no payable month", () => {
  const view = calculateFeeView({
    account,
    pauses: [{ startMonth: "2026-10", endMonth: null }],
    rates,
    asOfMonth: "2026-12",
  });
  assert.equal(view.currentStatus, "paused");
  assert.equal(view.nextUnpaidPayableMonth, null);
  assert.equal(view.coverageBlockedReason, "OPEN_PAUSE");
  assert.deepEqual(view.pendingMonths, []);
});

test("future closure is derived and blocks coverage", () => {
  const closingAccount = { ...account, closedFromMonth: "2027-01" };
  assert.equal(
    calculateFeeView({ account: closingAccount, rates, asOfMonth: "2026-12" }).currentStatus,
    "active"
  );
  assert.equal(
    calculateFeeView({ account: closingAccount, rates, asOfMonth: "2027-01" }).currentStatus,
    "closed"
  );
  assert.throws(
    () => selectNextPayableMonths(closingAccount, [], 4),
    (error) => error.code === "COVERAGE_BLOCKED_BY_CLOSURE"
  );
});

test("calculates 12 payable months at 1500 as 18000", () => {
  const emptyAccount = { ...account, paidThroughMonth: null, totalPaid: 0 };
  const selected = selectNextPayableMonths(emptyAccount, [], 12);
  const calculated = calculateCoverageAmount(selected.payableMonths, rates);
  assert.equal(calculated.totalAmount, 18000);
  assert.equal(selected.payableMonths.length, 12);
});

test("calculates coverage across a rate boundary", () => {
  const boundaryAccount = { ...account, paidThroughMonth: "2027-04" };
  const selected = selectNextPayableMonths(boundaryAccount, [], 2, {
    asOfMonth: "2026-09",
  });
  const calculated = calculateCoverageAmount(selected.payableMonths, rates);
  assert.deepEqual(selected.payableMonths, ["2027-05", "2027-06"]);
  assert.deepEqual(calculated.monthAmounts.map(({ amount }) => amount), [1500, 1700]);
  assert.equal(calculated.totalAmount, 3200);
});

test("rejects more than 12 payable months", () => {
  assert.throws(
    () => selectNextPayableMonths(account, [], 13),
    (error) => error.code === "INVALID_COVERAGE_MONTH_COUNT"
  );
});

test("allows a first request to cover 12 future payable months", () => {
  const currentAccount = { ...account, paidThroughMonth: "2026-09" };
  const selected = selectNextPayableMonths(currentAccount, [], 12, {
    asOfMonth: "2026-09",
  });
  assert.equal(selected.payableMonths.length, 12);
  assert.equal(selected.payableMonths.at(-1), "2027-09");
});

test("rejects a later request that would create a thirteenth future prepaid month", () => {
  const prepaidAccount = { ...account, paidThroughMonth: "2027-09" };
  assert.throws(
    () => selectNextPayableMonths(prepaidAccount, [], 1, { asOfMonth: "2026-09" }),
    (error) =>
      error.code === "FUTURE_PREPAID_LIMIT_EXCEEDED" &&
      error.details.existingFuturePrepaidMonths === 12 &&
      error.details.resultingFuturePrepaidMonths === 13
  );
});

test("overdue and current months do not consume the future prepaid allowance", () => {
  const overdueAccount = {
    ...account,
    billingStartMonth: "2026-06",
    paidThroughMonth: null,
    totalPaid: 0,
  };
  const selected = selectNextPayableMonths(overdueAccount, [], 12, {
    asOfMonth: "2026-09",
  });
  assert.deepEqual(selected.payableMonths.slice(0, 4), [
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
  ]);
  assert.equal(selected.payableMonths.at(-1), "2027-05");
});

test("a mixed overdue, current, and future request counts only resulting future months", () => {
  const overdueAccount = {
    ...account,
    billingStartMonth: "2026-06",
    paidThroughMonth: null,
    totalPaid: 0,
  };
  const selected = selectNextPayableMonths(overdueAccount, [], 6, {
    asOfMonth: "2026-09",
  });
  assert.deepEqual(selected.payableMonths, [
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
    "2026-10",
    "2026-11",
  ]);
});

test("paused months are skipped and do not consume future prepaid allowance", () => {
  const pauses = [{ startMonth: "2026-12", endMonth: "2027-02" }];
  const selected = selectNextPayableMonths(account, pauses, 12, {
    asOfMonth: "2026-09",
  });
  assert.deepEqual(selected.skippedPausedMonths, ["2026-12", "2027-01", "2027-02"]);
  assert.equal(selected.payableMonths.length, 12);
  assert.equal(selected.payableMonths.at(-1), "2027-12");
});

test("repeated sequential requests cannot bypass the future prepaid limit", () => {
  const first = selectNextPayableMonths(account, [], 10, { asOfMonth: "2026-09" });
  const afterFirst = { ...account, paidThroughMonth: first.payableMonths.at(-1) };
  const second = selectNextPayableMonths(afterFirst, [], 2, { asOfMonth: "2026-09" });
  const afterSecond = { ...account, paidThroughMonth: second.payableMonths.at(-1) };

  assert.throws(
    () => selectNextPayableMonths(afterSecond, [], 1, { asOfMonth: "2026-09" }),
    (error) => error.code === "FUTURE_PREPAID_LIMIT_EXCEEDED"
  );
});

test("future advance counting crosses December to January", () => {
  const decemberAccount = { ...account, paidThroughMonth: "2026-12" };
  const selected = selectNextPayableMonths(decemberAccount, [], 12, {
    asOfMonth: "2026-12",
  });
  assert.equal(selected.payableMonths[0], "2027-01");
  assert.equal(selected.payableMonths.at(-1), "2027-12");
});

test("future advance counting crosses the June to May financial-year boundary", () => {
  const mayAccount = { ...account, paidThroughMonth: "2027-05" };
  const selected = selectNextPayableMonths(mayAccount, [], 12, {
    asOfMonth: "2027-05",
  });
  assert.equal(selected.payableMonths[0], "2027-06");
  assert.equal(selected.payableMonths.at(-1), "2028-05");
});

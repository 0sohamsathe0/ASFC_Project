import assert from "node:assert/strict";
import test from "node:test";

import {
  addMonths,
  compareMonths,
  getCurrentClubMonth,
  getFinancialYearRange,
  isMonthInRange,
  isValidFeeMonth,
  iterateMonths,
  previousMonth,
} from "../utils/fee-month.js";
import { validateBillingStartMonth } from "../utils/fee-validation.js";

test("validates strict fee months", () => {
  ["2026-06", "0001-01", "9999-12"].forEach((month) =>
    assert.equal(isValidFeeMonth(month), true)
  );
  ["2026-6", "2026-00", "2026-13", "0000-01", null, 202606].forEach((month) =>
    assert.equal(isValidFeeMonth(month), false)
  );
});

test("compares, advances, and iterates months across years", () => {
  assert.equal(compareMonths("2026-12", "2027-01"), -1);
  assert.equal(addMonths("2026-12", 1), "2027-01");
  assert.equal(previousMonth("2027-01"), "2026-12");
  assert.deepEqual(iterateMonths("2026-11", "2027-02"), [
    "2026-11",
    "2026-12",
    "2027-01",
    "2027-02",
  ]);
});

test("uses the India month at the UTC month boundary", () => {
  assert.equal(getCurrentClubMonth(new Date("2026-08-31T18:29:59.000Z")), "2026-08");
  assert.equal(getCurrentClubMonth(new Date("2026-08-31T18:30:00.000Z")), "2026-09");
});

test("builds the ASFC June through May financial year", () => {
  assert.deepEqual(getFinancialYearRange(2026), {
    startMonth: "2026-06",
    endMonth: "2027-05",
    label: "2026-27",
  });
  assert.equal(isMonthInRange("2027-05", "2026-06", "2027-05"), true);
  assert.equal(isMonthInRange("2027-06", "2026-06", "2027-05"), false);
});

test("validates billing start against the digital start and current club month", () => {
  assert.equal(validateBillingStartMonth("2026-05", "2026-09").valid, false);
  assert.equal(validateBillingStartMonth("2026-06", "2026-09").valid, true);
  assert.equal(validateBillingStartMonth("2026-09", "2026-09").valid, true);
  assert.equal(validateBillingStartMonth("2026-10", "2026-09").valid, false);
});

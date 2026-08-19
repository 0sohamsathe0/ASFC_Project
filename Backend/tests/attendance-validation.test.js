import test from "node:test";
import assert from "node:assert/strict";

import {
  getMonthDateRange,
  isValidAttendanceDate,
  isValidAttendanceMonth,
  isValidAttendanceSession,
  isValidAttendanceStatus,
} from "../utils/attendance-validation.js";

test("accepts real calendar dates, including leap day", () => {
  assert.equal(isValidAttendanceDate("2026-08-19"), true);
  assert.equal(isValidAttendanceDate("2024-02-29"), true);
});

test("rejects impossible or incorrectly formatted dates", () => {
  const invalidDates = [
    "2026-02-29",
    "2026-02-31",
    "2026-13-10",
    "2026-00-05",
    "2026-04-31",
    "2026-8-19",
    "not-a-date",
    null,
  ];

  invalidDates.forEach((date) => {
    assert.equal(isValidAttendanceDate(date), false);
  });
});

test("validates attendance months and calculates their string date ranges", () => {
  assert.equal(isValidAttendanceMonth("2024-02"), true);
  assert.equal(isValidAttendanceMonth("2024-13"), false);
  assert.deepEqual(getMonthDateRange("2024-02"), {
    startDate: "2024-02-01",
    endDate: "2024-02-29",
  });
  assert.deepEqual(getMonthDateRange("2026-02"), {
    startDate: "2026-02-01",
    endDate: "2026-02-28",
  });
});

test("accepts only finalized attendance sessions and statuses", () => {
  assert.equal(isValidAttendanceSession("Morning"), true);
  assert.equal(isValidAttendanceSession("Evening"), true);
  assert.equal(isValidAttendanceSession("Both"), false);
  assert.equal(isValidAttendanceStatus("Present"), true);
  assert.equal(isValidAttendanceStatus("Absent"), true);
  assert.equal(isValidAttendanceStatus("Late"), false);
});

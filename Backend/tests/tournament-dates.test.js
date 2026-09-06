import assert from "node:assert/strict";
import test from "node:test";

import {
  getClubDateBoundary,
  getTournamentScheduleQuery,
} from "../utils/tournament-dates.js";

test("uses the ASFC calendar date at the India midnight boundary", () => {
  const beforeIndiaMidnight = new Date("2026-09-05T18:29:59.000Z");
  const afterIndiaMidnight = new Date("2026-09-05T18:30:00.000Z");

  assert.equal(getClubDateBoundary(beforeIndiaMidnight).toISOString(), "2026-09-05T00:00:00.000Z");
  assert.equal(getClubDateBoundary(afterIndiaMidnight).toISOString(), "2026-09-06T00:00:00.000Z");
});

test("keeps a tournament ending today ongoing for the full club calendar day", () => {
  const now = new Date("2026-09-06T12:00:00.000Z");
  const { filter } = getTournamentScheduleQuery("ongoing", now);

  assert.equal(filter.startingDate.$lte.toISOString(), "2026-09-06T00:00:00.000Z");
  assert.equal(filter.endDate.$gte.toISOString(), "2026-09-06T00:00:00.000Z");
});

test("sorts upcoming nearest-first and completed most-recent-first", () => {
  assert.deepEqual(getTournamentScheduleQuery("upcoming").sort, { startingDate: 1 });
  assert.deepEqual(getTournamentScheduleQuery("completed").sort, { endDate: -1 });
});

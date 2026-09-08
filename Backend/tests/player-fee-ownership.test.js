import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import mongoose from "mongoose";

import { getOwnFeeAccount } from "../controllers/player-fee-controller.js";
import FeeAccount from "../models/fee-account-model.js";
import FeePause from "../models/fee-pause-model.js";
import FeeRate from "../models/fee-rate-model.js";
import Player from "../models/player-model.js";

afterEach(() => mock.restoreAll());

const queryResult = (value) => ({
  select() { return this; },
  sort() { return this; },
  async lean() { return value; },
});

test("player fee lookup uses only the authenticated player ID", async () => {
  const authenticatedId = new mongoose.Types.ObjectId();
  const suppliedId = new mongoose.Types.ObjectId();
  let accountFilter;
  mock.method(FeeAccount, "findOne", (filter) => {
    accountFilter = filter;
    return queryResult({
      _id: new mongoose.Types.ObjectId(),
      playerId: authenticatedId,
      billingStartMonth: "2026-06",
      paidThroughMonth: null,
      totalPaid: 0,
      closedFromMonth: null,
      __v: 0,
    });
  });
  mock.method(FeePause, "find", () => queryResult([]));
  mock.method(FeeRate, "find", () => queryResult([
    { amount: 1500, effectiveFromMonth: "2026-06" },
  ]));
  mock.method(Player, "findById", (id) => {
    assert.equal(id, authenticatedId.toString());
    return queryResult({
      _id: authenticatedId,
      fullName: "Authenticated Player",
      event: "Epee",
      photoURL: "https://example.test/player.jpg",
    });
  });

  const response = {
    statusCode: 200,
    payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
  await getOwnFeeAccount(
    {
      user: { id: authenticatedId.toString() },
      params: { playerId: suppliedId.toString() },
      query: {},
    },
    response
  );

  assert.deepEqual(accountFilter, { playerId: authenticatedId.toString() });
  assert.equal(response.statusCode, 200);
  assert.equal(response.payload.success, true);
  assert.equal(response.payload.data.currentMonthlyRate, 1500);
  assert.equal(response.payload.data.player.fullName, "Authenticated Player");
});

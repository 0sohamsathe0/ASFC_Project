import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";

import FeeAccount from "../models/fee-account-model.js";
import FeePause from "../models/fee-pause-model.js";
import FeeRate from "../models/fee-rate-model.js";

const playerId = new mongoose.Types.ObjectId();

test("validates an empty fee account", async () => {
  const account = new FeeAccount({ playerId, billingStartMonth: "2026-06" });
  await account.validate();
  assert.equal(account.paidThroughMonth, null);
  assert.equal(account.totalPaid, 0);
  assert.equal(account.closedFromMonth, null);
});

test("rejects inconsistent fee coverage totals", async () => {
  await assert.rejects(
    new FeeAccount({ playerId, billingStartMonth: "2026-06", totalPaid: 1500 }).validate()
  );
  await assert.rejects(
    new FeeAccount({
      playerId,
      billingStartMonth: "2026-06",
      paidThroughMonth: "2026-06",
      totalPaid: 0,
    }).validate()
  );
});

test("rejects coverage before billing start and closure inside coverage", async () => {
  await assert.rejects(
    new FeeAccount({
      playerId,
      billingStartMonth: "2026-07",
      paidThroughMonth: "2026-06",
      totalPaid: 1500,
    }).validate()
  );
  await assert.rejects(
    new FeeAccount({
      playerId,
      billingStartMonth: "2026-06",
      paidThroughMonth: "2026-08",
      totalPaid: 4500,
      closedFromMonth: "2026-08",
    }).validate()
  );
});

test("validates positive integer fee rates", async () => {
  await new FeeRate({ amount: 1500, effectiveFromMonth: "2026-06" }).validate();
  await assert.rejects(new FeeRate({ amount: 0, effectiveFromMonth: "2026-06" }).validate());
  await assert.rejects(new FeeRate({ amount: 1500.5, effectiveFromMonth: "2026-06" }).validate());
});

test("ignores changes to established immutable fee-rate fields", async () => {
  const rate = FeeRate.hydrate({
    _id: new mongoose.Types.ObjectId(),
    amount: 1500,
    effectiveFromMonth: "2026-06",
  });

  rate.amount = 1700;
  rate.effectiveFromMonth = "2027-06";
  await rate.validate();

  assert.equal(rate.amount, 1500);
  assert.equal(rate.effectiveFromMonth, "2026-06");
  assert.equal(rate.isModified("amount"), false);
  assert.equal(rate.isModified("effectiveFromMonth"), false);
});

test("derives open pause from null end and validates bounded ranges", async () => {
  const openPause = new FeePause({ playerId, startMonth: "2026-10" });
  await openPause.validate();
  assert.equal(openPause.endMonth, null);

  await new FeePause({
    playerId,
    startMonth: "2026-10",
    endMonth: "2026-12",
  }).validate();

  await assert.rejects(
    new FeePause({
      playerId,
      startMonth: "2026-10",
      endMonth: "2026-09",
    }).validate()
  );
});

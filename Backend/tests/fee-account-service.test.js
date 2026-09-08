import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import mongoose from "mongoose";

import FeeAccount from "../models/fee-account-model.js";
import FeePause from "../models/fee-pause-model.js";
import FeeRate from "../models/fee-rate-model.js";
import Player from "../models/player-model.js";
import {
  acceptPlayerWithFeeAccount,
  closeFeeAccount,
  correctFeeCoverage,
  extendFeeCoverage,
  getFeeAccountView,
  getFeeOverview,
  initializeLegacyFeeAccount,
  listFeeAccounts,
  previewFeeCoverage,
  reactivateFeeAccount,
  startFeePause,
} from "../services/fee-account-service.js";
import { addFeeRate } from "../services/fee-rate-service.js";

afterEach(() => mock.restoreAll());

const playerId = new mongoose.Types.ObjectId();
const accountId = new mongoose.Types.ObjectId();
const baseAccount = {
  _id: accountId,
  playerId,
  billingStartMonth: "2026-06",
  paidThroughMonth: "2026-09",
  totalPaid: 6000,
  closedFromMonth: null,
  __v: 2,
};
const rates = [{ amount: 1500, effectiveFromMonth: "2026-06" }];

const queryResult = (value) => ({
  collation() { return this; },
  limit() { return this; },
  populate() { return this; },
  select() { return this; },
  skip() { return this; },
  sort() { return this; },
  session() { return this; },
  async lean() { return value; },
});

const mockEmptyAccountList = ({ mockPlayers = true } = {}) => {
  mock.method(FeeAccount, "find", () => queryResult([]));
  mock.method(FeePause, "find", () => queryResult([]));
  mock.method(FeeRate, "find", () => queryResult(rates));
  if (mockPlayers) mock.method(Player, "find", () => queryResult([]));
};

const createMockSession = (onRollback) => ({
  async withTransaction(callback) {
    try {
      await callback();
    } catch (error) {
      onRollback?.();
      throw error;
    }
  },
  async endSession() {},
});

const mockFeeContext = (account = baseAccount, pauses = [], rateRecords = rates) => {
  mock.method(FeeAccount, "findOne", () => queryResult(account));
  mock.method(FeePause, "find", () => queryResult(pauses));
  mock.method(FeeRate, "find", () => queryResult(rateRecords));
};

test("extends coverage atomically from the expected account position", async () => {
  mockFeeContext();
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));
  let updateFilter;
  let updateDocument;
  mock.method(FeeAccount, "findOneAndUpdate", (filter, update) => {
    updateFilter = filter;
    updateDocument = update;
    return queryResult({ ...baseAccount, paidThroughMonth: "2026-11", totalPaid: 9000, __v: 3 });
  });

  const result = await extendFeeCoverage({
    playerId: playerId.toString(),
    expectedPaidThroughMonth: "2026-09",
    expectedVersion: 2,
    numberOfMonths: 2,
  });

  assert.deepEqual(result.coveredPayableMonths, ["2026-10", "2026-11"]);
  assert.equal(result.calculatedAmount, 3000);
  assert.equal(updateFilter.__v, 2);
  assert.equal(updateFilter.paidThroughMonth, "2026-09");
  assert.equal(updateDocument.$inc.totalPaid, 3000);
  assert.equal(updateDocument.$inc.__v, 1);
});

test("rejects stale duplicate coverage submissions", async () => {
  mockFeeContext({ ...baseAccount, paidThroughMonth: "2026-10", totalPaid: 7500, __v: 3 });
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));

  await assert.rejects(
    extendFeeCoverage({
      playerId: playerId.toString(),
      expectedPaidThroughMonth: "2026-09",
      expectedVersion: 2,
      numberOfMonths: 1,
    }),
    (error) => error.code === "FEE_ACCOUNT_CONFLICT" && error.status === 409
  );
});

test("applies correctedTotalPaid as a trusted administrative override", async () => {
  mockFeeContext();
  let updateDocument;
  mock.method(FeeAccount, "findOneAndUpdate", (filter, update) => {
    updateDocument = update;
    return queryResult({
      ...baseAccount,
      paidThroughMonth: "2026-08",
      totalPaid: 4321,
      __v: 3,
    });
  });

  const result = await correctFeeCoverage({
    playerId: playerId.toString(),
    expectedPaidThroughMonth: "2026-09",
    expectedVersion: 2,
    correctedPaidThroughMonth: "2026-08",
    correctedTotalPaid: 4321,
    confirmed: true,
  });

  assert.equal(updateDocument.$set.totalPaid, 4321);
  assert.equal(result.overrideApplied, true);
  assert.equal(result.account.totalPaid, 4321);
});

test("legacy initialization accepts only Accepted players", async () => {
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Pending" }));
  await assert.rejects(
    initializeLegacyFeeAccount({
      playerId: playerId.toString(),
      billingStartMonth: "2026-06",
    }),
    (error) => error.code === "PLAYER_NOT_ACCEPTED"
  );
});

test("player acceptance creates its FeeAccount inside the same transaction callback", async () => {
  let transactionInvoked = false;
  let sessionEnded = false;
  const session = {
    async withTransaction(callback) {
      transactionInvoked = true;
      await callback();
    },
    async endSession() { sessionEnded = true; },
  };
  const player = {
    requestStatus: "Pending",
    isEditable: false,
    rejectionReason: "",
    async save(options) {
      assert.equal(options.session, session);
      return this;
    },
  };
  mock.method(mongoose, "startSession", async () => session);
  mock.method(Player, "findById", () => ({
    async session(receivedSession) {
      assert.equal(receivedSession, session);
      return player;
    },
  }));
  mock.method(FeeAccount, "create", async (documents, options) => {
    assert.equal(options.session, session);
    return [{ ...documents[0], __v: 0 }];
  });

  const accepted = await acceptPlayerWithFeeAccount({
    playerId: playerId.toString(),
    billingStartMonth: "2026-06",
  });

  assert.equal(transactionInvoked, true);
  assert.equal(sessionEnded, true);
  assert.equal(accepted.requestStatus, "Accepted");
});

test("adding a future rate inserts only a FeeRate document", async () => {
  let created;
  let accountUpdates = 0;
  mock.method(FeeRate, "create", async (document) => {
    created = document;
    return document;
  });
  mock.method(FeeAccount, "updateMany", async () => {
    accountUpdates += 1;
  });
  const result = await addFeeRate({ amount: 1700, effectiveFromMonth: "2099-06" });
  assert.deepEqual(created, { amount: 1700, effectiveFromMonth: "2099-06" });
  assert.equal(result.amount, 1700);
  assert.equal(accountUpdates, 0);
  assert.equal(baseAccount.totalPaid, 6000);
});

test("maps a duplicate fee-rate start month to conflict", async () => {
  mock.method(FeeRate, "create", async () => {
    const error = new Error("duplicate");
    error.code = 11000;
    throw error;
  });
  await assert.rejects(
    addFeeRate({ amount: 1700, effectiveFromMonth: "2099-06" }),
    (error) => error.code === "FEE_RATE_ALREADY_EXISTS" && error.status === 409
  );
});

test("schedules a future pause and bumps the account version in one transaction", async () => {
  const session = {
    async withTransaction(callback) { await callback(); },
    async endSession() {},
  };
  mock.method(mongoose, "startSession", async () => session);
  mock.method(FeeAccount, "findOne", () => queryResult(baseAccount));
  mock.method(FeePause, "findOne", () => queryResult(null));
  mock.method(FeePause, "create", async (documents, options) => {
    assert.equal(options.session, session);
    return [{ ...documents[0], __v: 0 }];
  });
  let versionFilter;
  mock.method(FeeAccount, "updateOne", async (filter, update, options) => {
    versionFilter = filter;
    assert.equal(update.$inc.__v, 1);
    assert.equal(options.session, session);
    return { modifiedCount: 1 };
  });

  const pause = await startFeePause({
    playerId: playerId.toString(),
    startMonth: "2099-01",
    expectedPaidThroughMonth: "2026-09",
    expectedVersion: 2,
  });
  assert.equal(pause.startMonth, "2099-01");
  assert.equal(versionFilter.__v, 2);
});

test("reactivation closes the open pause and increments the account version transactionally", async () => {
  const session = createMockSession();
  mock.method(mongoose, "startSession", async () => session);
  const closingLaterAccount = { ...baseAccount, closedFromMonth: "2099-06" };
  mock.method(FeeAccount, "findOne", () => queryResult(closingLaterAccount));
  const openPause = {
    _id: new mongoose.Types.ObjectId(),
    playerId,
    startMonth: "2099-01",
    endMonth: null,
    __v: 0,
  };
  mock.method(FeePause, "findOne", () => queryResult(openPause));
  let updateDocument;
  mock.method(FeePause, "findOneAndUpdate", (filter, update, options) => {
    updateDocument = update;
    assert.equal(options.session, session);
    return queryResult({ ...openPause, endMonth: "2099-03", __v: 1 });
  });
  let accountFilter;
  mock.method(FeeAccount, "findOneAndUpdate", (filter, update, options) => {
    accountFilter = filter;
    assert.equal(update.$inc.__v, 1);
    assert.equal(options.session, session);
    return queryResult({ ...closingLaterAccount, __v: 3 });
  });

  const result = await reactivateFeeAccount({
    playerId: playerId.toString(),
    reactivationMonth: "2099-04",
    expectedVersion: 2,
    expectedPauseVersion: 0,
  });
  assert.equal(updateDocument.$set.endMonth, "2099-03");
  assert.equal(result.pause.endMonth, "2099-03");
  assert.equal(result.account.__v, 3);
  assert.equal(accountFilter.__v, 2);
  assert.equal(accountFilter.closedFromMonth, "2099-06");
});

test("reactivation rejects a stale FeeAccount version", async () => {
  const session = createMockSession();
  mock.method(mongoose, "startSession", async () => session);
  mock.method(FeeAccount, "findOne", () => queryResult({ ...baseAccount, __v: 3 }));

  await assert.rejects(
    reactivateFeeAccount({
      playerId: playerId.toString(),
      reactivationMonth: "2099-04",
      expectedVersion: 2,
      expectedPauseVersion: 0,
    }),
    (error) => error.code === "FEE_ACCOUNT_CONFLICT" && error.status === 409
  );
});

test("reactivation rejects a stale FeePause version", async () => {
  const session = createMockSession();
  mock.method(mongoose, "startSession", async () => session);
  mock.method(FeeAccount, "findOne", () => queryResult(baseAccount));
  mock.method(FeePause, "findOne", () => queryResult({
    _id: new mongoose.Types.ObjectId(),
    startMonth: "2099-01",
    endMonth: null,
    __v: 1,
  }));

  await assert.rejects(
    reactivateFeeAccount({
      playerId: playerId.toString(),
      reactivationMonth: "2099-04",
      expectedVersion: 2,
      expectedPauseVersion: 0,
    }),
    (error) => error.code === "FEE_PAUSE_CONFLICT" && error.status === 409
  );
});

const assertClosureBlocksReactivation = async (reactivationMonth) => {
  const session = createMockSession();
  mock.method(mongoose, "startSession", async () => session);
  mock.method(FeeAccount, "findOne", () => queryResult({
    ...baseAccount,
    closedFromMonth: "2099-06",
  }));
  mock.method(FeePause, "findOne", () => queryResult({
    _id: new mongoose.Types.ObjectId(),
    startMonth: "2099-01",
    endMonth: null,
    __v: 0,
  }));

  await assert.rejects(
    reactivateFeeAccount({
      playerId: playerId.toString(),
      reactivationMonth,
      expectedVersion: 2,
      expectedPauseVersion: 0,
    }),
    (error) => error.code === "REACTIVATION_CONFLICTS_WITH_CLOSURE"
  );
};

test("reactivation exactly at closure is rejected", async () => {
  await assertClosureBlocksReactivation("2099-06");
});

test("reactivation after closure is rejected", async () => {
  await assertClosureBlocksReactivation("2099-07");
});

test("reactivation racing with closure returns conflict and rolls back the pause update", async () => {
  let pausePersisted = false;
  let rolledBack = false;
  const session = createMockSession(() => {
    pausePersisted = false;
    rolledBack = true;
  });
  mock.method(mongoose, "startSession", async () => session);
  mock.method(FeeAccount, "findOne", () => queryResult(baseAccount));
  mock.method(FeePause, "findOne", () => queryResult({
    _id: new mongoose.Types.ObjectId(),
    startMonth: "2099-01",
    endMonth: null,
    __v: 0,
  }));
  mock.method(FeePause, "findOneAndUpdate", () => {
    pausePersisted = true;
    return queryResult({ endMonth: "2099-03", __v: 1 });
  });
  mock.method(FeeAccount, "findOneAndUpdate", () => queryResult(null));

  await assert.rejects(
    reactivateFeeAccount({
      playerId: playerId.toString(),
      reactivationMonth: "2099-04",
      expectedVersion: 2,
      expectedPauseVersion: 0,
    }),
    (error) => error.code === "FEE_ACCOUNT_CONFLICT" && error.status === 409
  );
  assert.equal(rolledBack, true);
  assert.equal(pausePersisted, false);
});

test("reactivation does not update the account when the pause conditional update fails", async () => {
  let accountUpdateCalls = 0;
  let rolledBack = false;
  const session = createMockSession(() => { rolledBack = true; });
  mock.method(mongoose, "startSession", async () => session);
  mock.method(FeeAccount, "findOne", () => queryResult(baseAccount));
  mock.method(FeePause, "findOne", () => queryResult({
    _id: new mongoose.Types.ObjectId(),
    startMonth: "2099-01",
    endMonth: null,
    __v: 0,
  }));
  mock.method(FeePause, "findOneAndUpdate", () => queryResult(null));
  mock.method(FeeAccount, "findOneAndUpdate", () => {
    accountUpdateCalls += 1;
    return queryResult(baseAccount);
  });

  await assert.rejects(
    reactivateFeeAccount({
      playerId: playerId.toString(),
      reactivationMonth: "2099-04",
      expectedVersion: 2,
      expectedPauseVersion: 0,
    }),
    (error) => error.code === "FEE_PAUSE_CONFLICT" && error.status === 409
  );
  assert.equal(rolledBack, true);
  assert.equal(accountUpdateCalls, 0);
});

test("fee-account search accepts and trims a normal string", async () => {
  const playerFilters = [];
  mock.method(Player, "find", (filter) => {
    playerFilters.push(filter);
    return queryResult([]);
  });
  mockEmptyAccountList({ mockPlayers: false });

  await listFeeAccounts({ search: "  virat  " });
  assert.equal(playerFilters[0].fullName.$regex, "virat");
  assert.equal(playerFilters[1].fullName.$regex, "virat");
});

test("fee-account search accepts an empty or absent search", async () => {
  mockEmptyAccountList();
  assert.equal((await listFeeAccounts({ search: "" })).total, 0);

  mock.restoreAll();
  mockEmptyAccountList();
  assert.equal((await listFeeAccounts()).total, 0);
});

test("fee-account search rejects repeated query values as a 400", async () => {
  await assert.rejects(
    listFeeAccounts({ search: ["a", "b"] }),
    (error) => error.code === "INVALID_FEE_SEARCH" && error.status === 400
  );
});

test("fee-account search rejects objects and overlong strings as a 400", async () => {
  await assert.rejects(
    listFeeAccounts({ search: { name: "virat" } }),
    (error) => error.code === "INVALID_FEE_SEARCH" && error.status === 400
  );
  await assert.rejects(
    listFeeAccounts({ search: "a".repeat(101) }),
    (error) => error.code === "INVALID_FEE_SEARCH" && error.status === 400
  );
});

test("terminal closure is a versioned single-account update", async () => {
  mockFeeContext();
  let updateFilter;
  mock.method(FeeAccount, "findOneAndUpdate", (filter) => {
    updateFilter = filter;
    return queryResult({ ...baseAccount, closedFromMonth: "2026-10", __v: 3 });
  });

  const closed = await closeFeeAccount({
    playerId: playerId.toString(),
    closedFromMonth: "2026-10",
    expectedPaidThroughMonth: "2026-09",
    expectedVersion: 2,
    confirmed: true,
  });
  assert.equal(updateFilter.closedFromMonth, null);
  assert.equal(updateFilter.__v, 2);
  assert.equal(closed.closedFromMonth, "2026-10");
});

test("coverage preview returns a backend projection without mutating the account", async () => {
  mockFeeContext();
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));
  let mutationCalls = 0;
  mock.method(FeeAccount, "findOneAndUpdate", () => {
    mutationCalls += 1;
    return queryResult(null);
  });

  const result = await previewFeeCoverage({
    playerId: playerId.toString(),
    expectedPaidThroughMonth: "2026-09",
    expectedVersion: 2,
    numberOfMonths: 3,
  });

  assert.deepEqual(result.coveredPayableMonths, ["2026-10", "2026-11", "2026-12"]);
  assert.deepEqual(result.skippedPausedMonths, []);
  assert.deepEqual(result.monthAmounts.map(({ amount }) => amount), [1500, 1500, 1500]);
  assert.equal(result.calculatedAmount, 4500);
  assert.equal(result.currentPaidThroughMonth, "2026-09");
  assert.equal(result.projectedPaidThroughMonth, "2026-12");
  assert.equal(result.existingFuturePrepaidCount, 0);
  assert.equal(result.additionalFuturePrepaidCount, 3);
  assert.equal(result.resultingFuturePrepaidCount, 3);
  assert.equal(result.maximumFuturePrepaidMonths, 12);
  assert.equal(result.expectedVersion, 2);
  assert.equal(mutationCalls, 0);
});

test("preview and final mutation produce the same projection when state is unchanged", async () => {
  mockFeeContext();
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));
  mock.method(FeeAccount, "findOneAndUpdate", () => queryResult({
    ...baseAccount,
    paidThroughMonth: "2026-11",
    totalPaid: 9000,
    __v: 3,
  }));
  const request = {
    playerId: playerId.toString(),
    expectedPaidThroughMonth: "2026-09",
    expectedVersion: 2,
    numberOfMonths: 2,
  };

  const preview = await previewFeeCoverage(request);
  const mutation = await extendFeeCoverage(request);

  for (const field of [
    "asOfMonth",
    "currentPaidThroughMonth",
    "projectedPaidThroughMonth",
    "coveredPayableMonths",
    "skippedPausedMonths",
    "monthAmounts",
    "calculatedAmount",
    "existingFuturePrepaidCount",
    "additionalFuturePrepaidCount",
    "resultingFuturePrepaidCount",
    "maximumFuturePrepaidMonths",
    "expectedVersion",
  ]) {
    assert.deepEqual(mutation[field], preview[field]);
  }
});

test("coverage preview crosses a fee-rate boundary", async () => {
  const boundaryAccount = {
    ...baseAccount,
    paidThroughMonth: "2027-04",
    totalPaid: 16500,
    __v: 4,
  };
  mockFeeContext(boundaryAccount, [], [
    { amount: 1500, effectiveFromMonth: "2026-06" },
    { amount: 1700, effectiveFromMonth: "2027-06" },
  ]);
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));

  const result = await previewFeeCoverage({
    playerId: playerId.toString(),
    expectedPaidThroughMonth: "2027-04",
    expectedVersion: 4,
    numberOfMonths: 2,
  });

  assert.deepEqual(result.coveredPayableMonths, ["2027-05", "2027-06"]);
  assert.deepEqual(result.monthAmounts.map(({ amount }) => amount), [1500, 1700]);
  assert.equal(result.calculatedAmount, 3200);
});

test("coverage preview skips a bounded pause", async () => {
  mockFeeContext(baseAccount, [{
    playerId,
    startMonth: "2026-10",
    endMonth: "2026-12",
  }]);
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));

  const result = await previewFeeCoverage({
    playerId: playerId.toString(),
    expectedPaidThroughMonth: "2026-09",
    expectedVersion: 2,
    numberOfMonths: 2,
  });
  assert.deepEqual(result.skippedPausedMonths, ["2026-10", "2026-11", "2026-12"]);
  assert.deepEqual(result.coveredPayableMonths, ["2027-01", "2027-02"]);
});

test("coverage preview preserves open-pause and closure blocking errors", async () => {
  mockFeeContext(baseAccount, [{
    playerId,
    startMonth: "2026-10",
    endMonth: null,
  }]);
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));
  await assert.rejects(
    previewFeeCoverage({
      playerId: playerId.toString(),
      expectedPaidThroughMonth: "2026-09",
      expectedVersion: 2,
      numberOfMonths: 1,
    }),
    (error) => error.code === "COVERAGE_BLOCKED_BY_OPEN_PAUSE" && error.status === 422
  );

  mock.restoreAll();
  mockFeeContext({ ...baseAccount, closedFromMonth: "2026-10" });
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));
  await assert.rejects(
    previewFeeCoverage({
      playerId: playerId.toString(),
      expectedPaidThroughMonth: "2026-09",
      expectedVersion: 2,
      numberOfMonths: 1,
    }),
    (error) => error.code === "COVERAGE_BLOCKED_BY_CLOSURE" && error.status === 422
  );
});

test("coverage preview enforces the resulting future-prepaid limit", async () => {
  const prepaidAccount = { ...baseAccount, paidThroughMonth: "2027-09", __v: 5 };
  mockFeeContext(prepaidAccount);
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));

  await assert.rejects(
    previewFeeCoverage({
      playerId: playerId.toString(),
      expectedPaidThroughMonth: "2027-09",
      expectedVersion: 5,
      numberOfMonths: 1,
    }),
    (error) => error.code === "FUTURE_PREPAID_LIMIT_EXCEEDED" && error.status === 422
  );
});

test("coverage preview rejects stale paid-through and version expectations", async () => {
  mockFeeContext();
  mock.method(Player, "findById", () => queryResult({ requestStatus: "Accepted" }));
  await assert.rejects(
    previewFeeCoverage({
      playerId: playerId.toString(),
      expectedPaidThroughMonth: "2026-08",
      expectedVersion: 2,
      numberOfMonths: 1,
    }),
    (error) => error.code === "FEE_ACCOUNT_CONFLICT" && error.status === 409
  );
  await assert.rejects(
    previewFeeCoverage({
      playerId: playerId.toString(),
      expectedPaidThroughMonth: "2026-09",
      expectedVersion: 1,
      numberOfMonths: 1,
    }),
    (error) => error.code === "FEE_ACCOUNT_CONFLICT" && error.status === 409
  );
});

test("account list returns safe calculated DTOs and filters before pagination", async () => {
  const pendingPlayer = {
    _id: new mongoose.Types.ObjectId(),
    fullName: "Pending Player",
    event: "Epee",
    photoURL: "https://example.test/pending.jpg",
    email: "private@example.test",
    aadharCard: "111122223333",
  };
  const currentPlayer = {
    _id: new mongoose.Types.ObjectId(),
    fullName: "Current Player",
    event: "Foil",
    photoURL: "https://example.test/current.jpg",
  };
  const populatedAccounts = [
    {
      ...baseAccount,
      playerId: currentPlayer,
      paidThroughMonth: "2026-09",
    },
    {
      ...baseAccount,
      _id: new mongoose.Types.ObjectId(),
      playerId: pendingPlayer,
      paidThroughMonth: "2026-08",
      totalPaid: 4500,
    },
  ];
  mock.method(FeeAccount, "find", () => queryResult(populatedAccounts));
  mock.method(FeePause, "find", () => queryResult([]));
  mock.method(FeeRate, "find", () => queryResult(rates));
  mock.method(Player, "find", () => queryResult([]));

  const result = await listFeeAccounts({ feeState: "pending", page: 1, limit: 1 });

  assert.equal(result.total, 1);
  assert.equal(result.accounts.length, 1);
  assert.equal(result.accounts[0].player.fullName, "Pending Player");
  assert.deepEqual(Object.keys(result.accounts[0].player).sort(), [
    "_id",
    "event",
    "fullName",
    "photoURL",
  ]);
  assert.equal(result.accounts[0].nextUnpaidPayableMonth, "2026-09");
  assert.equal(result.accounts[0].pendingPayableMonthCount, 1);
  assert.equal(result.accounts[0].futurePrepaidPayableMonthCount, 0);
  assert.equal(result.accounts[0].currentOutstanding, 1500);
  assert.equal(result.accounts[0].currentMonthlyRate, 1500);
  assert.equal(result.accounts[0].version, 2);
});

test("account list supports uninitialized and up-to-date filters", async () => {
  const initializedPlayer = {
    _id: new mongoose.Types.ObjectId(),
    fullName: "Initialized Player",
    event: "Sabre",
    photoURL: "",
  };
  const uninitializedPlayer = {
    _id: new mongoose.Types.ObjectId(),
    fullName: "Legacy Player",
    event: "Foil",
    photoURL: "",
  };
  mock.method(FeeAccount, "find", () => queryResult([{
    ...baseAccount,
    playerId: initializedPlayer,
  }]));
  mock.method(FeePause, "find", () => queryResult([]));
  mock.method(FeeRate, "find", () => queryResult(rates));
  mock.method(Player, "find", () => queryResult([uninitializedPlayer]));

  const uninitialized = await listFeeAccounts({ feeState: "uninitialized" });
  assert.equal(uninitialized.total, 1);
  assert.equal(uninitialized.accounts[0].initialized, false);
  assert.equal(uninitialized.accounts[0].player.fullName, "Legacy Player");

  const upToDate = await listFeeAccounts({ feeState: "up-to-date" });
  assert.equal(upToDate.total, 1);
  assert.equal(upToDate.accounts[0].player.fullName, "Initialized Player");
});

test("account list applies derived status filters before pagination", async () => {
  const activePlayer = {
    _id: new mongoose.Types.ObjectId(),
    fullName: "Active Player",
    event: "Epee",
    photoURL: "",
  };
  const pausedPlayer = {
    _id: new mongoose.Types.ObjectId(),
    fullName: "Paused Player",
    event: "Foil",
    photoURL: "",
  };
  const accountRecords = [
    { ...baseAccount, playerId: activePlayer },
    { ...baseAccount, _id: new mongoose.Types.ObjectId(), playerId: pausedPlayer },
  ];
  mock.method(FeeAccount, "find", () => queryResult(accountRecords));
  mock.method(FeePause, "find", () => queryResult([{
    playerId: pausedPlayer._id,
    startMonth: "2026-09",
    endMonth: null,
  }]));
  mock.method(FeeRate, "find", () => queryResult(rates));
  mock.method(Player, "find", () => queryResult([]));

  const result = await listFeeAccounts({ feeState: "paused", page: 1, limit: 1 });
  assert.equal(result.total, 1);
  assert.equal(result.accounts[0].player.fullName, "Paused Player");
  assert.equal(result.accounts[0].currentStatus, "paused");
});

test("account list rejects malformed fee-state filters", async () => {
  await assert.rejects(
    listFeeAccounts({ feeState: ["pending", "up-to-date"] }),
    (error) => error.code === "INVALID_FEE_STATE_FILTER" && error.status === 400
  );
  await assert.rejects(
    listFeeAccounts({ feeState: "unknown" }),
    (error) => error.code === "INVALID_FEE_STATE_FILTER" && error.status === 400
  );
});

test("fee overview returns authoritative payment, initialization, and derived status totals", async () => {
  const accountRecords = [
    { ...baseAccount, playerId: new mongoose.Types.ObjectId() },
    {
      ...baseAccount,
      _id: new mongoose.Types.ObjectId(),
      playerId: new mongoose.Types.ObjectId(),
      paidThroughMonth: "2026-08",
      totalPaid: 4500,
    },
    {
      ...baseAccount,
      _id: new mongoose.Types.ObjectId(),
      playerId: new mongoose.Types.ObjectId(),
      closedFromMonth: "2026-09",
    },
  ];
  const pauseRecords = [{
    playerId: accountRecords[0].playerId,
    startMonth: "2026-09",
    endMonth: null,
  }];
  mock.method(FeeAccount, "find", () => queryResult(accountRecords));
  mock.method(FeePause, "find", () => queryResult(pauseRecords));
  mock.method(FeeRate, "find", () => queryResult(rates));
  mock.method(Player, "countDocuments", async () => 2);

  const result = await getFeeOverview();

  assert.deepEqual(result.totals, {
    totalRecordedPaid: 16500,
    totalCurrentOutstanding: 1500,
    initializedAccountCount: 3,
    uninitializedAcceptedPlayerCount: 2,
    pendingAccountCount: 1,
    upToDateAccountCount: 2,
    activeAccountCount: 1,
    pausedAccountCount: 1,
    closedAccountCount: 1,
  });
});

test("admin fee detail includes only safe player header fields and current rate", async () => {
  mockFeeContext({ ...baseAccount, closedFromMonth: "2026-09" });
  mock.method(Player, "findById", () => queryResult({
    _id: playerId,
    fullName: "Safe Player",
    event: "Epee",
    photoURL: "https://example.test/safe.jpg",
    email: "private@example.test",
    aadharCardURL: "https://example.test/private.pdf",
  }));

  const result = await getFeeAccountView({ playerId: playerId.toString() });

  assert.deepEqual(Object.keys(result.player).sort(), ["_id", "event", "fullName", "photoURL"]);
  assert.equal(result.player.fullName, "Safe Player");
  assert.equal(result.currentMonthlyRate, 1500);
  assert.equal(result.summary.currentStatus, "closed");
  assert.equal(result.summary.months.at(-1).scheduledRate, null);
});

test("paused detail still exposes the current monthly rate", async () => {
  mockFeeContext(baseAccount, [{
    playerId,
    startMonth: "2026-09",
    endMonth: null,
  }]);
  mock.method(Player, "findById", () => queryResult({
    _id: playerId,
    fullName: "Paused Player",
    event: "Foil",
    photoURL: "",
  }));

  const result = await getFeeAccountView({ playerId: playerId.toString() });
  assert.equal(result.summary.currentStatus, "paused");
  assert.equal(result.currentMonthlyRate, 1500);
  assert.equal(result.summary.months.at(-1).scheduledRate, null);
});

test("fee detail returns a controlled domain error when the current rate is missing", async () => {
  mockFeeContext(baseAccount, [], []);
  mock.method(Player, "findById", () => queryResult({
    _id: playerId,
    fullName: "Player Without Rate",
    event: "Epee",
    photoURL: "",
  }));

  await assert.rejects(
    getFeeAccountView({ playerId: playerId.toString() }),
    (error) => error.code === "FEE_RATE_NOT_FOUND" && error.status === 422
  );
});

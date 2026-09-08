import mongoose from "mongoose";

import { MAX_ADVANCE_PAYABLE_MONTHS } from "../config/fee-config.js";
import FeeAccount from "../models/fee-account-model.js";
import FeePause from "../models/fee-pause-model.js";
import FeeRate from "../models/fee-rate-model.js";
import Player from "../models/player-model.js";
import {
  calculateCoverageAmount,
  calculateFeeView,
  countFuturePrepaidPayableMonths,
  getStatusForMonth,
  requireApplicableRate,
  selectNextPayableMonths,
} from "./fee-calculation-service.js";
import { FeeServiceError, isDuplicateKeyError } from "./fee-errors.js";
import {
  compareMonths,
  getCurrentClubMonth,
  getFinancialYearRange,
  isValidFeeMonth,
  previousMonth,
} from "../utils/fee-month.js";
import {
  isSafeNonNegativeInteger,
  validateBillingStartMonth,
} from "../utils/fee-validation.js";

const ensureObjectId = (value, label = "playerId") => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new FeeServiceError(`A valid ${label} is required.`, {
      status: 400,
      code: "INVALID_PLAYER_ID",
    });
  }
};

const ensureExpectedPosition = (account, expectedPaidThroughMonth, expectedVersion) => {
  if (expectedPaidThroughMonth !== null && !isValidFeeMonth(expectedPaidThroughMonth)) {
    throw new FeeServiceError(
      "expectedPaidThroughMonth must be null or use valid YYYY-MM format.",
      { status: 400, code: "INVALID_EXPECTED_COVERAGE" }
    );
  }
  if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
    throw new FeeServiceError("expectedVersion must be a non-negative integer.", {
      status: 400,
      code: "INVALID_EXPECTED_VERSION",
    });
  }
  if (
    account.paidThroughMonth !== expectedPaidThroughMonth ||
    account.__v !== expectedVersion
  ) {
    throw new FeeServiceError(
      "The fee account changed after it was displayed. Refresh and try again.",
      { status: 409, code: "FEE_ACCOUNT_CONFLICT" }
    );
  }
};

const ensureExpectedAccountVersion = (account, expectedVersion) => {
  if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
    throw new FeeServiceError("expectedVersion must be a non-negative integer.", {
      status: 400,
      code: "INVALID_EXPECTED_VERSION",
    });
  }
  if (account.__v !== expectedVersion) {
    throw new FeeServiceError(
      "The fee account changed after it was displayed. Refresh and try again.",
      { status: 409, code: "FEE_ACCOUNT_CONFLICT" }
    );
  }
};

const createAccountDocument = async ({ playerId, billingStartMonth, session }) => {
  const validation = validateBillingStartMonth(billingStartMonth);
  if (!validation.valid) {
    throw new FeeServiceError(validation.message, {
      status: 400,
      code: "INVALID_BILLING_START_MONTH",
    });
  }

  try {
    const [account] = await FeeAccount.create(
      [{ playerId, billingStartMonth, paidThroughMonth: null, totalPaid: 0 }],
      session ? { session } : undefined
    );
    return account;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new FeeServiceError("A fee account already exists for this player.", {
        status: 409,
        code: "FEE_ACCOUNT_ALREADY_EXISTS",
      });
    }
    throw error;
  }
};

const acceptPlayerWithFeeAccount = async ({ playerId, billingStartMonth }) => {
  ensureObjectId(playerId);
  const validation = validateBillingStartMonth(billingStartMonth);
  if (!validation.valid) {
    throw new FeeServiceError(validation.message, {
      status: 400,
      code: "INVALID_BILLING_START_MONTH",
    });
  }

  const session = await mongoose.startSession();
  let acceptedPlayer;
  try {
    await session.withTransaction(async () => {
      const player = await Player.findById(playerId).session(session);
      if (!player) {
        throw new FeeServiceError("Player not found.", {
          status: 404,
          code: "PLAYER_NOT_FOUND",
        });
      }
      if (player.requestStatus === "Accepted") {
        throw new FeeServiceError(
          "Player is already accepted. Use legacy fee-account initialization if needed.",
          { status: 409, code: "PLAYER_ALREADY_ACCEPTED" }
        );
      }

      await createAccountDocument({ playerId, billingStartMonth, session });
      player.requestStatus = "Accepted";
      player.isEditable = true;
      player.rejectionReason = "";
      acceptedPlayer = await player.save({ session });
    });
    return acceptedPlayer;
  } finally {
    await session.endSession();
  }
};

const initializeLegacyFeeAccount = async ({ playerId, billingStartMonth }) => {
  ensureObjectId(playerId);
  const player = await Player.findById(playerId).select("requestStatus").lean();
  if (!player) {
    throw new FeeServiceError("Player not found.", {
      status: 404,
      code: "PLAYER_NOT_FOUND",
    });
  }
  if (player.requestStatus !== "Accepted") {
    throw new FeeServiceError("Only Accepted players may receive a fee account.", {
      code: "PLAYER_NOT_ACCEPTED",
    });
  }
  return createAccountDocument({ playerId, billingStartMonth });
};

const listUninitializedAcceptedPlayers = async () => {
  const initializedPlayerIds = await FeeAccount.distinct("playerId");
  return Player.find({
    requestStatus: "Accepted",
    _id: { $nin: initializedPlayerIds },
  })
    .select("fullName event photoURL createdAt")
    .sort({ fullName: 1 })
    .collation({ locale: "en", strength: 2 })
    .lean();
};

const loadFeeContext = async (playerId) => {
  ensureObjectId(playerId);
  const [account, pauses, rates] = await Promise.all([
    FeeAccount.findOne({ playerId }).lean(),
    FeePause.find({ playerId }).sort({ startMonth: 1 }).lean(),
    FeeRate.find().sort({ effectiveFromMonth: 1 }).lean(),
  ]);
  if (!account) {
    throw new FeeServiceError("Fee account not found.", {
      status: 404,
      code: "FEE_ACCOUNT_NOT_FOUND",
    });
  }
  return { account, pauses, rates };
};

const toSafePlayer = (player) => ({
  _id: player._id,
  fullName: player.fullName,
  event: player.event,
  photoURL: player.photoURL ?? "",
});

const getCurrentMonthlyRate = (rates, asOfMonth = getCurrentClubMonth()) =>
  requireApplicableRate(rates, asOfMonth).amount;

const calculateCoverageProjection = ({
  account,
  pauses,
  rates,
  numberOfMonths,
  asOfMonth = getCurrentClubMonth(),
}) => {
  const selection = selectNextPayableMonths(account, pauses, numberOfMonths, { asOfMonth });
  const calculated = calculateCoverageAmount(selection.payableMonths, rates);
  const existingFuturePrepaidCount = countFuturePrepaidPayableMonths(
    account,
    pauses,
    account.paidThroughMonth,
    asOfMonth
  );
  const resultingFuturePrepaidCount = countFuturePrepaidPayableMonths(
    account,
    pauses,
    selection.payableMonths.at(-1),
    asOfMonth
  );

  return {
    asOfMonth,
    currentPaidThroughMonth: account.paidThroughMonth,
    projectedPaidThroughMonth: selection.payableMonths.at(-1),
    coveredPayableMonths: selection.payableMonths,
    skippedPausedMonths: selection.skippedPausedMonths,
    monthAmounts: calculated.monthAmounts,
    calculatedAmount: calculated.totalAmount,
    existingFuturePrepaidCount,
    additionalFuturePrepaidCount:
      resultingFuturePrepaidCount - existingFuturePrepaidCount,
    resultingFuturePrepaidCount,
    maximumFuturePrepaidMonths: MAX_ADVANCE_PAYABLE_MONTHS,
    expectedVersion: account.__v,
  };
};

const prepareCoverageProjection = async ({
  playerId,
  expectedPaidThroughMonth,
  expectedVersion,
  numberOfMonths,
}) => {
  ensureObjectId(playerId);
  const [{ account, pauses, rates }, player] = await Promise.all([
    loadFeeContext(playerId),
    Player.findById(playerId).select("requestStatus").lean(),
  ]);
  if (!player) {
    throw new FeeServiceError("Player not found.", {
      status: 404,
      code: "PLAYER_NOT_FOUND",
    });
  }
  if (player.requestStatus !== "Accepted") {
    throw new FeeServiceError("Only Accepted players may receive fee coverage.", {
      code: "PLAYER_NOT_ACCEPTED",
    });
  }
  ensureExpectedPosition(account, expectedPaidThroughMonth, expectedVersion);

  return {
    account,
    pauses,
    rates,
    projection: calculateCoverageProjection({ account, pauses, rates, numberOfMonths }),
  };
};

const buildViewOptions = (financialYearStart) => {
  if (financialYearStart === undefined) return {};
  const range = getFinancialYearRange(financialYearStart);
  if (!range) {
    throw new FeeServiceError("financialYearStart must be a valid year.", {
      status: 400,
      code: "INVALID_FINANCIAL_YEAR",
    });
  }
  return {
    financialYear: range,
    viewStartMonth: range.startMonth,
    viewEndMonth: range.endMonth,
  };
};

const getFeeAccountView = async ({ playerId, financialYearStart }) => {
  ensureObjectId(playerId);
  const [context, player] = await Promise.all([
    loadFeeContext(playerId),
    Player.findById(playerId).select("fullName event photoURL").lean(),
  ]);
  if (!player) {
    throw new FeeServiceError("Player not found.", {
      status: 404,
      code: "PLAYER_NOT_FOUND",
    });
  }
  const viewOptions = buildViewOptions(financialYearStart);
  const view = calculateFeeView({ ...context, ...viewOptions });
  return {
    player: toSafePlayer(player),
    account: context.account,
    pauses: context.pauses,
    financialYear: viewOptions.financialYear,
    currentMonthlyRate: getCurrentMonthlyRate(context.rates, view.asOfMonth),
    summary: view,
  };
};

const listFeeAccounts = async ({
  page = 1,
  limit = 20,
  search = "",
  feeState = "all",
} = {}) => {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || !Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
    throw new FeeServiceError("page and limit must be valid positive integers; limit cannot exceed 100.", {
      status: 400,
      code: "INVALID_PAGINATION",
    });
  }

  if (typeof search !== "string") {
    throw new FeeServiceError("search must be a single string.", {
      status: 400,
      code: "INVALID_FEE_SEARCH",
    });
  }
  const trimmedSearch = search.trim();
  if (trimmedSearch.length > 100) {
    throw new FeeServiceError("search cannot exceed 100 characters.", {
      status: 400,
      code: "INVALID_FEE_SEARCH",
    });
  }

  if (
    typeof feeState !== "string" ||
    ![
      "all",
      "active",
      "paused",
      "closed",
      "pending",
      "up-to-date",
      "uninitialized",
    ].includes(feeState)
  ) {
    throw new FeeServiceError(
      "feeState must be one of all, active, paused, closed, pending, up-to-date, or uninitialized.",
      { status: 400, code: "INVALID_FEE_STATE_FILTER" }
    );
  }

  let playerFilter;
  if (trimmedSearch) {
    const escaped = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const players = await Player.find({ fullName: { $regex: escaped, $options: "i" } })
      .select("_id")
      .lean();
    playerFilter = { playerId: { $in: players.map(({ _id }) => _id) } };
  } else {
    playerFilter = {};
  }

  const accounts = await FeeAccount.find(playerFilter)
    .populate("playerId", "fullName event photoURL")
    .sort({ updatedAt: -1 })
    .lean();
  const initializedPlayerIds = accounts
    .map(({ playerId }) => playerId?._id)
    .filter(Boolean);
  const uninitializedFilter = {
    requestStatus: "Accepted",
    _id: { $nin: initializedPlayerIds },
    ...(trimmedSearch
      ? { fullName: { $regex: trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
      : {}),
  };
  const [pauses, rates, uninitializedPlayers] = await Promise.all([
    FeePause.find({ playerId: { $in: initializedPlayerIds } })
      .sort({ startMonth: 1 })
      .lean(),
    FeeRate.find().sort({ effectiveFromMonth: 1 }).lean(),
    Player.find(uninitializedFilter)
      .select("fullName event photoURL")
      .sort({ fullName: 1 })
      .collation({ locale: "en", strength: 2 })
      .lean(),
  ]);
  const currentMonth = getCurrentClubMonth();
  const currentMonthlyRate = getCurrentMonthlyRate(rates, currentMonth);
  const pausesByPlayer = new Map();
  pauses.forEach((pause) => {
    const key = pause.playerId.toString();
    pausesByPlayer.set(key, [...(pausesByPlayer.get(key) || []), pause]);
  });

  const initializedEntries = accounts
    .filter(({ playerId }) => Boolean(playerId?._id))
    .map((account) => {
      const player = account.playerId;
      const playerPauses = pausesByPlayer.get(player._id.toString()) || [];
      const summary = calculateFeeView({ account, pauses: playerPauses, rates });
      return {
        initialized: true,
        player: toSafePlayer(player),
        billingStartMonth: account.billingStartMonth,
        paidThroughMonth: account.paidThroughMonth,
        currentStatus: summary.currentStatus,
        currentMonthlyRate,
        totalPaid: account.totalPaid,
        currentOutstanding: summary.currentOutstanding,
        nextUnpaidPayableMonth: summary.nextUnpaidPayableMonth,
        pendingPayableMonthCount: summary.pendingMonths.length,
        futurePrepaidPayableMonthCount: summary.futurePrepaidMonths.length,
        version: account.__v,
      };
    });
  const uninitializedEntries = uninitializedPlayers.map((player) => ({
    initialized: false,
    player: toSafePlayer(player),
    billingStartMonth: null,
    paidThroughMonth: null,
    currentStatus: "uninitialized",
    currentMonthlyRate,
    totalPaid: 0,
    currentOutstanding: 0,
    nextUnpaidPayableMonth: null,
    pendingPayableMonthCount: 0,
    futurePrepaidPayableMonthCount: 0,
    version: null,
  }));
  const entries = [...initializedEntries, ...uninitializedEntries].filter((entry) => {
    if (["active", "paused", "closed"].includes(feeState)) {
      return entry.initialized && entry.currentStatus === feeState;
    }
    if (feeState === "pending") return entry.initialized && entry.currentOutstanding > 0;
    if (feeState === "up-to-date") return entry.initialized && entry.currentOutstanding === 0;
    if (feeState === "uninitialized") return !entry.initialized;
    return true;
  });
  const total = entries.length;
  const offset = (pageNumber - 1) * limitNumber;

  return {
    page: pageNumber,
    limit: limitNumber,
    feeState,
    total,
    totalPages: Math.ceil(total / limitNumber),
    accounts: entries.slice(offset, offset + limitNumber),
  };
};

const getFeeOverview = async ({ financialYearStart } = {}) => {
  const viewOptions = buildViewOptions(financialYearStart);
  const [accounts, pauses, rates] = await Promise.all([
    FeeAccount.find().lean(),
    FeePause.find().sort({ startMonth: 1 }).lean(),
    FeeRate.find().sort({ effectiveFromMonth: 1 }).lean(),
  ]);
  const initializedPlayerIds = accounts.map(({ playerId }) => playerId);
  const uninitializedAcceptedPlayerCount = await Player.countDocuments({
    requestStatus: "Accepted",
    _id: { $nin: initializedPlayerIds },
  });
  const pausesByPlayer = new Map();
  pauses.forEach((pause) => {
    const key = pause.playerId.toString();
    pausesByPlayer.set(key, [...(pausesByPlayer.get(key) || []), pause]);
  });

  const totals = {
    totalRecordedPaid: 0,
    totalCurrentOutstanding: 0,
    initializedAccountCount: accounts.length,
    uninitializedAcceptedPlayerCount,
    pendingAccountCount: 0,
    upToDateAccountCount: 0,
    activeAccountCount: 0,
    pausedAccountCount: 0,
    closedAccountCount: 0,
  };
  accounts.forEach((account) => {
    const summary = calculateFeeView({
      account,
      pauses: pausesByPlayer.get(account.playerId.toString()) || [],
      rates,
      ...viewOptions,
    });
    totals[`${summary.currentStatus}AccountCount`] += 1;
    totals.totalRecordedPaid += account.totalPaid;
    totals.totalCurrentOutstanding += summary.currentOutstanding;
    if (summary.currentOutstanding > 0) totals.pendingAccountCount += 1;
    else totals.upToDateAccountCount += 1;
  });
  return { financialYear: viewOptions.financialYear, totals };
};

const previewFeeCoverage = async (request) => {
  const { projection } = await prepareCoverageProjection(request);
  return projection;
};

const extendFeeCoverage = async ({
  playerId,
  expectedPaidThroughMonth,
  expectedVersion,
  numberOfMonths,
}) => {
  const { account, pauses, rates, projection } = await prepareCoverageProjection({
    playerId,
    expectedPaidThroughMonth,
    expectedVersion,
    numberOfMonths,
  });
  if (!Number.isSafeInteger(account.totalPaid + projection.calculatedAmount)) {
    throw new FeeServiceError("The resulting total exceeds the supported integer range.", {
      code: "FEE_TOTAL_OUT_OF_RANGE",
    });
  }
  const updated = await FeeAccount.findOneAndUpdate(
    {
      _id: account._id,
      paidThroughMonth: expectedPaidThroughMonth,
      closedFromMonth: account.closedFromMonth,
      __v: expectedVersion,
    },
    {
      $set: { paidThroughMonth: projection.projectedPaidThroughMonth },
      $inc: { totalPaid: projection.calculatedAmount, __v: 1 },
    },
    { returnDocument: "after", runValidators: true }
  ).lean();
  if (!updated) {
    throw new FeeServiceError(
      "The fee account changed after it was displayed. Refresh and try again.",
      { status: 409, code: "FEE_ACCOUNT_CONFLICT" }
    );
  }
  return {
    ...projection,
    account: updated,
    summary: calculateFeeView({ account: updated, pauses, rates }),
  };
};

const correctFeeCoverage = async ({
  playerId,
  expectedPaidThroughMonth,
  expectedVersion,
  correctedPaidThroughMonth,
  correctedTotalPaid,
  confirmed,
}) => {
  if (confirmed !== true) {
    throw new FeeServiceError("Explicit confirmation is required.", {
      status: 400,
      code: "CONFIRMATION_REQUIRED",
    });
  }
  const { account, pauses, rates } = await loadFeeContext(playerId);
  ensureExpectedPosition(account, expectedPaidThroughMonth, expectedVersion);
  if (correctedPaidThroughMonth !== null && !isValidFeeMonth(correctedPaidThroughMonth)) {
    throw new FeeServiceError("correctedPaidThroughMonth must be null or use valid YYYY-MM format.", {
      status: 400,
      code: "INVALID_CORRECTED_MONTH",
    });
  }
  if (!isSafeNonNegativeInteger(correctedTotalPaid)) {
    throw new FeeServiceError("correctedTotalPaid must be a non-negative safe integer.", {
      status: 400,
      code: "INVALID_CORRECTED_TOTAL",
    });
  }
  if (correctedPaidThroughMonth === null && correctedTotalPaid !== 0) {
    throw new FeeServiceError("A null paid-through month requires totalPaid to be zero.", {
      code: "INVALID_COVERAGE_POSITION",
    });
  }
  if (correctedPaidThroughMonth !== null) {
    if (correctedTotalPaid <= 0 || compareMonths(correctedPaidThroughMonth, account.billingStartMonth) < 0) {
      throw new FeeServiceError("The corrected coverage position is logically invalid.", {
        code: "INVALID_COVERAGE_POSITION",
      });
    }
    if (getStatusForMonth(account, pauses, correctedPaidThroughMonth) !== "active") {
      throw new FeeServiceError("The corrected paid-through month must be payable.", {
        code: "CORRECTED_MONTH_NOT_PAYABLE",
      });
    }
    calculateFeeView({
      account: { ...account, paidThroughMonth: correctedPaidThroughMonth, totalPaid: correctedTotalPaid },
      pauses,
      rates,
      asOfMonth: correctedPaidThroughMonth,
      viewEndMonth: correctedPaidThroughMonth,
    });
  }

  const updated = await FeeAccount.findOneAndUpdate(
    { _id: account._id, paidThroughMonth: expectedPaidThroughMonth, __v: expectedVersion },
    {
      $set: { paidThroughMonth: correctedPaidThroughMonth, totalPaid: correctedTotalPaid },
      $inc: { __v: 1 },
    },
    { returnDocument: "after", runValidators: true }
  ).lean();
  if (!updated) {
    throw new FeeServiceError(
      "The fee account changed after it was displayed. Refresh and try again.",
      { status: 409, code: "FEE_ACCOUNT_CONFLICT" }
    );
  }
  return {
    overrideApplied: true,
    account: updated,
    summary: calculateFeeView({ account: updated, pauses, rates }),
  };
};

const startFeePause = async ({ playerId, startMonth, expectedPaidThroughMonth, expectedVersion }) => {
  ensureObjectId(playerId);
  if (!isValidFeeMonth(startMonth)) {
    throw new FeeServiceError("startMonth must use valid YYYY-MM format.", {
      status: 400,
      code: "INVALID_FEE_MONTH",
    });
  }
  if (compareMonths(startMonth, getCurrentClubMonth()) < 0) {
    throw new FeeServiceError("A pause may begin only in the current or a future month.", {
      code: "RETROACTIVE_PAUSE_NOT_ALLOWED",
    });
  }

  const session = await mongoose.startSession();
  let createdPause;
  try {
    await session.withTransaction(async () => {
      const account = await FeeAccount.findOne({ playerId }).session(session).lean();
      if (!account) {
        throw new FeeServiceError("Fee account not found.", {
          status: 404,
          code: "FEE_ACCOUNT_NOT_FOUND",
        });
      }
      ensureExpectedPosition(account, expectedPaidThroughMonth, expectedVersion);
      if (
        account.paidThroughMonth &&
        compareMonths(startMonth, account.paidThroughMonth) <= 0
      ) {
        throw new FeeServiceError("A pause cannot begin inside already-covered months.", {
          code: "PAUSE_CONFLICTS_WITH_COVERAGE",
        });
      }
      if (account.closedFromMonth && compareMonths(startMonth, account.closedFromMonth) >= 0) {
        throw new FeeServiceError("A pause cannot begin in a closed period.", {
          code: "PAUSE_CONFLICTS_WITH_CLOSURE",
        });
      }
      const overlap = await FeePause.findOne({
        playerId,
        $or: [{ endMonth: null }, { endMonth: { $gte: startMonth } }],
      })
        .session(session)
        .lean();
      if (overlap) {
        throw new FeeServiceError("The requested pause overlaps an existing pause.", {
          status: 409,
          code: "FEE_PAUSE_OVERLAP",
        });
      }
      [createdPause] = await FeePause.create([{ playerId, startMonth, endMonth: null }], { session });
      const versionUpdate = await FeeAccount.updateOne(
        { _id: account._id, paidThroughMonth: expectedPaidThroughMonth, __v: expectedVersion },
        { $inc: { __v: 1 } },
        { session }
      );
      if (versionUpdate.modifiedCount !== 1) {
        throw new FeeServiceError(
          "The fee account changed after it was displayed. Refresh and try again.",
          { status: 409, code: "FEE_ACCOUNT_CONFLICT" }
        );
      }
    });
    return createdPause;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new FeeServiceError("An open or overlapping pause already exists.", {
        status: 409,
        code: "OPEN_PAUSE_ALREADY_EXISTS",
      });
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

const reactivateFeeAccount = async ({
  playerId,
  reactivationMonth,
  expectedVersion,
  expectedPauseVersion,
}) => {
  ensureObjectId(playerId);
  if (!isValidFeeMonth(reactivationMonth)) {
    throw new FeeServiceError("reactivationMonth must use valid YYYY-MM format.", {
      status: 400,
      code: "INVALID_FEE_MONTH",
    });
  }
  if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
    throw new FeeServiceError("expectedVersion must be a non-negative integer.", {
      status: 400,
      code: "INVALID_EXPECTED_VERSION",
    });
  }
  if (!Number.isInteger(expectedPauseVersion) || expectedPauseVersion < 0) {
    throw new FeeServiceError("expectedPauseVersion must be a non-negative integer.", {
      status: 400,
      code: "INVALID_EXPECTED_VERSION",
    });
  }

  const session = await mongoose.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      const account = await FeeAccount.findOne({ playerId }).session(session).lean();
      if (!account) {
        throw new FeeServiceError("Fee account not found.", {
          status: 404,
          code: "FEE_ACCOUNT_NOT_FOUND",
        });
      }
      ensureExpectedAccountVersion(account, expectedVersion);

      const openPause = await FeePause.findOne({ playerId, endMonth: null })
        .session(session)
        .lean();
      if (!openPause) {
        throw new FeeServiceError("Open fee pause not found.", {
          status: 404,
          code: "OPEN_PAUSE_NOT_FOUND",
        });
      }
      if (openPause.__v !== expectedPauseVersion) {
        throw new FeeServiceError(
          "The fee pause changed after it was displayed. Refresh and try again.",
          { status: 409, code: "FEE_PAUSE_CONFLICT" }
        );
      }
      if (
        account.closedFromMonth &&
        compareMonths(reactivationMonth, account.closedFromMonth) >= 0
      ) {
        throw new FeeServiceError(
          "Reactivation must begin before the account closure month.",
          { code: "REACTIVATION_CONFLICTS_WITH_CLOSURE" }
        );
      }
      if (compareMonths(reactivationMonth, openPause.startMonth) <= 0) {
        throw new FeeServiceError(
          "Reactivation must begin at least one month after pause start.",
          { code: "PAUSE_MUST_COVER_COMPLETE_MONTH" }
        );
      }

      const updatedPause = await FeePause.findOneAndUpdate(
        { _id: openPause._id, endMonth: null, __v: expectedPauseVersion },
        { $set: { endMonth: previousMonth(reactivationMonth) }, $inc: { __v: 1 } },
        { returnDocument: "after", runValidators: true, session }
      ).lean();
      if (!updatedPause) {
        throw new FeeServiceError(
          "The fee pause changed after it was displayed. Refresh and try again.",
          { status: 409, code: "FEE_PAUSE_CONFLICT" }
        );
      }

      const updatedAccount = await FeeAccount.findOneAndUpdate(
        {
          _id: account._id,
          __v: expectedVersion,
          closedFromMonth: account.closedFromMonth,
        },
        { $inc: { __v: 1 } },
        { returnDocument: "after", runValidators: true, session }
      ).lean();
      if (!updatedAccount) {
        throw new FeeServiceError(
          "The fee account changed after it was displayed. Refresh and try again.",
          { status: 409, code: "FEE_ACCOUNT_CONFLICT" }
        );
      }

      result = { pause: updatedPause, account: updatedAccount };
    });
    return result;
  } finally {
    await session.endSession();
  }
};

const closeFeeAccount = async ({
  playerId,
  closedFromMonth,
  expectedPaidThroughMonth,
  expectedVersion,
  confirmed,
}) => {
  if (confirmed !== true) {
    throw new FeeServiceError("Explicit confirmation is required.", {
      status: 400,
      code: "CONFIRMATION_REQUIRED",
    });
  }
  if (!isValidFeeMonth(closedFromMonth)) {
    throw new FeeServiceError("closedFromMonth must use valid YYYY-MM format.", {
      status: 400,
      code: "INVALID_FEE_MONTH",
    });
  }
  const { account } = await loadFeeContext(playerId);
  ensureExpectedPosition(account, expectedPaidThroughMonth, expectedVersion);
  if (account.closedFromMonth) {
    throw new FeeServiceError("This fee account is already terminally closed.", {
      status: 409,
      code: "FEE_ACCOUNT_ALREADY_CLOSED",
    });
  }
  if (
    compareMonths(closedFromMonth, account.billingStartMonth) < 0 ||
    (account.paidThroughMonth && compareMonths(closedFromMonth, account.paidThroughMonth) <= 0)
  ) {
    throw new FeeServiceError("Closure must begin after the final covered month.", {
      code: "CLOSURE_CONFLICTS_WITH_COVERAGE",
    });
  }
  const updated = await FeeAccount.findOneAndUpdate(
    { _id: account._id, paidThroughMonth: expectedPaidThroughMonth, closedFromMonth: null, __v: expectedVersion },
    { $set: { closedFromMonth }, $inc: { __v: 1 } },
    { returnDocument: "after", runValidators: true }
  ).lean();
  if (!updated) {
    throw new FeeServiceError(
      "The fee account changed after it was displayed. Refresh and try again.",
      { status: 409, code: "FEE_ACCOUNT_CONFLICT" }
    );
  }
  return updated;
};

export {
  acceptPlayerWithFeeAccount,
  calculateCoverageProjection,
  closeFeeAccount,
  correctFeeCoverage,
  extendFeeCoverage,
  getFeeAccountView,
  getFeeOverview,
  initializeLegacyFeeAccount,
  listFeeAccounts,
  listUninitializedAcceptedPlayers,
  previewFeeCoverage,
  reactivateFeeAccount,
  startFeePause,
};

import {
  closeFeeAccount as closeFeeAccountService,
  correctFeeCoverage as correctFeeCoverageService,
  extendFeeCoverage as extendFeeCoverageService,
  getFeeAccountView,
  getFeeOverview as getFeeOverviewService,
  initializeLegacyFeeAccount,
  listFeeAccounts as listFeeAccountsService,
  listUninitializedAcceptedPlayers as listUninitializedAcceptedPlayersService,
  previewFeeCoverage as previewFeeCoverageService,
  reactivateFeeAccount as reactivateFeeAccountService,
  startFeePause as startFeePauseService,
} from "../services/fee-account-service.js";
import { addFeeRate as addFeeRateService, listFeeRates as listFeeRatesService } from "../services/fee-rate-service.js";
import { FeeServiceError } from "../services/fee-errors.js";

const sendError = (res, error, fallbackMessage) => {
  if (error instanceof FeeServiceError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
      code: error.code,
      ...(error.details === undefined ? {} : { details: error.details }),
    });
  }
  console.error(fallbackMessage, error);
  return res.status(500).json({ success: false, message: fallbackMessage });
};

const initializeFeeAccount = async (req, res) => {
  try {
    const account = await initializeLegacyFeeAccount(req.body || {});
    return res.status(201).json({
      success: true,
      message: "Fee account initialized.",
      data: account,
    });
  } catch (error) {
    return sendError(res, error, "Unable to initialize the fee account.");
  }
};

const listUninitializedAcceptedPlayers = async (req, res) => {
  try {
    const players = await listUninitializedAcceptedPlayersService();
    return res.status(200).json({ success: true, count: players.length, data: players });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve uninitialized players.");
  }
};

const listFeeAccounts = async (req, res) => {
  try {
    const data = await listFeeAccountsService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve fee accounts.");
  }
};

const getFeeOverview = async (req, res) => {
  try {
    const data = await getFeeOverviewService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve the fee overview.");
  }
};

const getAdminFeeAccount = async (req, res) => {
  try {
    const data = await getFeeAccountView({
      playerId: req.params.playerId,
      financialYearStart: req.query.financialYearStart,
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve the fee account.");
  }
};

const extendFeeCoverage = async (req, res) => {
  try {
    const data = await extendFeeCoverageService({
      ...req.body,
      playerId: req.params.playerId,
    });
    return res.status(200).json({
      success: true,
      message: "Fee coverage recorded.",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to record fee coverage.");
  }
};

const previewFeeCoverage = async (req, res) => {
  try {
    const data = await previewFeeCoverageService({
      ...req.body,
      playerId: req.params.playerId,
    });
    return res.status(200).json({
      success: true,
      message: "Fee coverage preview calculated.",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to preview fee coverage.");
  }
};

const correctFeeCoverage = async (req, res) => {
  try {
    const data = await correctFeeCoverageService({
      ...req.body,
      playerId: req.params.playerId,
    });
    return res.status(200).json({
      success: true,
      message: "Fee coverage position corrected by administrative override.",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to correct fee coverage.");
  }
};

const startFeePause = async (req, res) => {
  try {
    const pause = await startFeePauseService({ ...req.body, playerId: req.params.playerId });
    return res.status(201).json({
      success: true,
      message: "Fee pause scheduled.",
      data: pause,
    });
  } catch (error) {
    return sendError(res, error, "Unable to schedule the fee pause.");
  }
};

const reactivateFeeAccount = async (req, res) => {
  try {
    const data = await reactivateFeeAccountService({
      ...req.body,
      playerId: req.params.playerId,
    });
    return res.status(200).json({
      success: true,
      message: "Fee account reactivated from the selected month.",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to reactivate the fee account.");
  }
};

const closeFeeAccount = async (req, res) => {
  try {
    const account = await closeFeeAccountService({
      ...req.body,
      playerId: req.params.playerId,
    });
    return res.status(200).json({
      success: true,
      message: "Fee account terminally closed.",
      data: account,
    });
  } catch (error) {
    return sendError(res, error, "Unable to close the fee account.");
  }
};

const listFeeRates = async (req, res) => {
  try {
    const rates = await listFeeRatesService();
    return res.status(200).json({ success: true, count: rates.length, data: rates });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve fee rates.");
  }
};

const addFeeRate = async (req, res) => {
  try {
    const rate = await addFeeRateService(req.body || {});
    return res.status(201).json({
      success: true,
      message: "Future fee rate added.",
      data: rate,
    });
  } catch (error) {
    return sendError(res, error, "Unable to add the fee rate.");
  }
};

export {
  addFeeRate,
  closeFeeAccount,
  correctFeeCoverage,
  extendFeeCoverage,
  getAdminFeeAccount,
  getFeeOverview,
  initializeFeeAccount,
  listFeeAccounts,
  listFeeRates,
  listUninitializedAcceptedPlayers,
  previewFeeCoverage,
  reactivateFeeAccount,
  startFeePause,
};

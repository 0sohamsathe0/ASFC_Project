import { Router } from "express";

import {
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
} from "../controllers/admin-fee-controller.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import verifyJWT from "../middlewares/auth-middleware.js";

const adminFeeRouter = Router();

adminFeeRouter.use(verifyJWT, authorizeRoles("admin"));

adminFeeRouter.post("/accounts", initializeFeeAccount);
adminFeeRouter.get("/uninitialized-players", listUninitializedAcceptedPlayers);
adminFeeRouter.get("/accounts", listFeeAccounts);
adminFeeRouter.get("/overview", getFeeOverview);
adminFeeRouter.get("/accounts/:playerId", getAdminFeeAccount);
adminFeeRouter.post("/accounts/:playerId/coverage/preview", previewFeeCoverage);
adminFeeRouter.post("/accounts/:playerId/coverage", extendFeeCoverage);
adminFeeRouter.patch("/accounts/:playerId/correction", correctFeeCoverage);
adminFeeRouter.post("/accounts/:playerId/pause", startFeePause);
adminFeeRouter.post("/accounts/:playerId/reactivate", reactivateFeeAccount);
adminFeeRouter.post("/accounts/:playerId/close", closeFeeAccount);
adminFeeRouter.get("/rates", listFeeRates);
adminFeeRouter.post("/rates", addFeeRate);

export default adminFeeRouter;

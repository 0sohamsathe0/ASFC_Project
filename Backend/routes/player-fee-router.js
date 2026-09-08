import { Router } from "express";

import { getOwnFeeAccount } from "../controllers/player-fee-controller.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import verifyJWT from "../middlewares/auth-middleware.js";

const playerFeeRouter = Router();

playerFeeRouter.use(verifyJWT, authorizeRoles("player"));
playerFeeRouter.get("/", getOwnFeeAccount);

export default playerFeeRouter;

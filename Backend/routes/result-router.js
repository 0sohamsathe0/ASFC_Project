import { Router } from "express";
import { getIndividualResult, addIndividualResult, getTeamResult, addTeamResult,getPlayerIndividualResults,getPlayerTeamResults } from "../controllers/result-controller.js";
import verifyJWT from "../middlewares/auth-middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const resultRouter = Router()

resultRouter.get("/individual/:tournamentId", getIndividualResult)
resultRouter.post('/individual',verifyJWT,authorizeRoles("admin"), addIndividualResult)
resultRouter.get('/team/:tournamentId', getTeamResult)
resultRouter.post('/team',verifyJWT,authorizeRoles("admin"), addTeamResult)
resultRouter.get("/player/individual/:playerId",getPlayerIndividualResults)
resultRouter.get("/player/team/:playerId",getPlayerTeamResults)
export default resultRouter
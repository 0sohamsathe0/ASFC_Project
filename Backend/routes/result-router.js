import { Router } from "express";
import { getIndividualResult, addIndividualResult, getTeamResult, addTeamResult,getPlayerIndividualResults,getPlayerTeamResults, getClubResults, getOwnPlayerIndividualResults, getOwnPlayerTeamResults } from "../controllers/result-controller.js";
import verifyJWT from "../middlewares/auth-middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const resultRouter = Router()

resultRouter.get("/individual/:tournamentId", getIndividualResult)
resultRouter.post('/individual',verifyJWT,authorizeRoles("admin"), addIndividualResult)
resultRouter.get('/team/:tournamentId', getTeamResult)
resultRouter.post('/team',verifyJWT,authorizeRoles("admin"), addTeamResult)
resultRouter.get("/player/individual",verifyJWT,authorizeRoles("player"),getOwnPlayerIndividualResults)
resultRouter.get("/player/team",verifyJWT,authorizeRoles("player"),getOwnPlayerTeamResults)
resultRouter.get("/player/individual/:playerId",verifyJWT,authorizeRoles("admin"),getPlayerIndividualResults)
resultRouter.get("/player/team/:playerId",verifyJWT,authorizeRoles("admin"),getPlayerTeamResults)

resultRouter.get("/club",getClubResults);

export default resultRouter

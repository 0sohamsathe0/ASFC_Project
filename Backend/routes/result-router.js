import { Router } from "express";
import { getIndividualResult, addIndividualResult, getTeamResult, addTeamResult,getPlayerIndividualResults,getPlayerTeamResults } from "../controllers/result-controller.js";

const resultRouter = Router()

resultRouter.get("/individual/:tournamentId", getIndividualResult)
resultRouter.post('/individual', addIndividualResult)
resultRouter.get('/team/:tournamentId', getTeamResult)
resultRouter.post('/team', addTeamResult)
resultRouter.get("/player/individual/:playerId",getPlayerIndividualResults)
resultRouter.get("/player/team/:playerId",getPlayerTeamResults)
export default resultRouter
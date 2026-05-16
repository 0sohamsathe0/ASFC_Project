import { Router } from "express";
import { getIndividualResult,addIndividualResult, getTeamResult, addTeamResult } from "../controllers/result-controller.js";
import { verifyAdmin } from "../middlewares/auth-middleware.js";

const resultRouter = Router()

resultRouter.get("/individual/:tournamentId",getIndividualResult)
resultRouter.post('/individual',addIndividualResult)
resultRouter.get('/team/:tournamentId',getTeamResult)
resultRouter.post('/team',addTeamResult)

export default resultRouter
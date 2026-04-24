import { Router } from "express";
import { getIndividualResult,addIndividualResult, getTeamResult, addTeamResult } from "../controllers/result-controller.js";
import { verifyAdmin } from "../middlewares/auth-middleware.js";

const resultRouter = Router()

resultRouter.get("/individual/:tournamentId",getIndividualResult)
resultRouter.post('/individual',verifyAdmin,addIndividualResult)
resultRouter.get('/team',verifyAdmin,getTeamResult)
resultRouter.post('/team',verifyAdmin,addTeamResult)

export default resultRouter
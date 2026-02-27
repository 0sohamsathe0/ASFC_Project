import express from "express";
import { Router} from "express";    
import { addPlayer , getPlayers} from "../controllers/player-controller.js";

const playerRouter = Router();

playerRouter.get("/getAllPlayers", getPlayers);

playerRouter.post("/add", addPlayer);

export default playerRouter;
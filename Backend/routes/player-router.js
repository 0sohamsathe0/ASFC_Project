import express from "express";
import { Router} from "express";    
import { upload } from "../middlewares/multer-middleware.js";
import { addPlayer , getPlayers} from "../controllers/player-controller.js";

const playerRouter = Router();

playerRouter.get("/getAllPlayers", getPlayers);

playerRouter.post("/add",upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'aadharCardPhoto', maxCount: 1 }]) ,addPlayer);

export default playerRouter;
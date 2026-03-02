import express from "express";
import { Router} from "express";    
import { upload } from "../middlewares/multer-middleware.js";
import { verifyPlayer } from "../middlewares/auth-middleware.js";
import { addPlayer , getPlayers, loginPlayer,getPlayerProfile, logoutPlayer} from "../controllers/player-controller.js";
import { get } from "mongoose";

const playerRouter = Router();

playerRouter.get("/getAllPlayers", getPlayers);
playerRouter.post("/login", loginPlayer);
playerRouter.post("/logout", logoutPlayer);

playerRouter.get("/profile", verifyPlayer,getPlayerProfile);

playerRouter.post("/add",upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'aadharCardPhoto', maxCount: 1 }]) ,addPlayer);

export default playerRouter;
import { Router} from "express";    
import { upload } from "../middlewares/multer-middleware.js";
import { verifyPlayer } from "../middlewares/auth-middleware.js";
import { addPlayer , getPlayers, loginPlayer,getPlayerProfile, logoutPlayer, updatePlayer} from "../controllers/player-controller.js";

const playerRouter = Router();

playerRouter.get("/getAllPlayers", getPlayers);
playerRouter.post("/add",upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'aadharCardPhoto', maxCount: 1 }]) ,addPlayer);
playerRouter.put("/:pid",updatePlayer)

playerRouter.post("/login", loginPlayer);
playerRouter.post("/logout", logoutPlayer);

playerRouter.get("/profile", verifyPlayer,getPlayerProfile);


export default playerRouter;
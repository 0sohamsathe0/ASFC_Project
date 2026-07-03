import { Router} from "express";    
import { upload } from "../middlewares/multer-middleware.js";
import  verifyJWT  from "../middlewares/auth-middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js"
import { addPlayer , getPlayers, loginPlayer,getPlayerProfile, logoutPlayer, updatePlayer} from "../controllers/player-controller.js";

const playerRouter = Router();

playerRouter.get("/getAllPlayers",verifyJWT,authorizeRoles("admin"), getPlayers);
playerRouter.post("/add",upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'aadharCardPhoto', maxCount: 1 }]) ,addPlayer);
playerRouter.put("/:pid",updatePlayer)

playerRouter.post("/login", loginPlayer);
playerRouter.post("/logout",verifyJWT,authorizeRoles("player"), logoutPlayer);

playerRouter.get("/profile", verifyJWT,authorizeRoles('player'),getPlayerProfile);


export default playerRouter;
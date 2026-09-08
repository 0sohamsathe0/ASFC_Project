import { Router} from "express";    
import { registrationUpload } from "../middlewares/multer-middleware.js";
import  verifyJWT  from "../middlewares/auth-middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js"
import { addPlayer, getOwnAadhaarDocument, getPlayers, loginPlayer,getPlayerProfile, logoutPlayer, updateOwnPlayer, updatePlayer} from "../controllers/player-controller.js";
import { getPlayerAttendance } from "../controllers/attendance-controller.js";
import { playerLoginLimiter, registrationLimiter } from "../middlewares/rate-limit-middleware.js";

const playerRouter = Router();

playerRouter.get("/getAllPlayers",verifyJWT,authorizeRoles("admin"), getPlayers);
playerRouter.post("/add", registrationLimiter, registrationUpload, addPlayer);
playerRouter.put("/:pid",verifyJWT,authorizeRoles("admin"),updatePlayer)

playerRouter.post("/login", playerLoginLimiter, loginPlayer);
playerRouter.post("/logout",verifyJWT,authorizeRoles("player","admin"), logoutPlayer);

playerRouter.get("/profile", verifyJWT,authorizeRoles('player'),getPlayerProfile);
playerRouter.patch("/profile", verifyJWT, authorizeRoles("player"), updateOwnPlayer);
playerRouter.get("/profile/aadhaar-document", verifyJWT, authorizeRoles("player"), getOwnAadhaarDocument);
playerRouter.get("/attendance", verifyJWT, authorizeRoles("player"), getPlayerAttendance);


export default playerRouter;

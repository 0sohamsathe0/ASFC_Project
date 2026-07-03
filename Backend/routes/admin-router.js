import { Router} from "express";    
import { getPendingPlayers,acceptPlayer,rejectPlayer,loginAdmin,makeEveryonePending } from "../controllers/admin-controller.js";
import verifyJWT from "../middlewares/auth-middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);

adminRouter.get("/getPendingPlayers",verifyJWT,authorizeRoles('admin'),getPendingPlayers);
adminRouter.patch("/acceptPlayer/:playerId",verifyJWT,authorizeRoles('admin'),acceptPlayer);
adminRouter.patch("/rejectPlayer",verifyJWT,authorizeRoles('admin'),rejectPlayer);
adminRouter.patch("/makePending",verifyJWT,authorizeRoles('admin'),makeEveryonePending)

export default adminRouter;

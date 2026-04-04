import { Router} from "express";    
import { getPendingPlayers,acceptPlayer,rejectPlayer,loginAdmin,makeEveryonePending } from "../controllers/admin-controller.js";
import { verifyAdmin } from "../middlewares/auth-middleware.js";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);

adminRouter.get("/getPendingPlayers",verifyAdmin,getPendingPlayers);
adminRouter.patch("/acceptPlayer/:playerId",verifyAdmin,acceptPlayer);
adminRouter.patch("/rejectPlayer",verifyAdmin,rejectPlayer);
adminRouter.patch("/makePending",makeEveryonePending)

export default adminRouter;

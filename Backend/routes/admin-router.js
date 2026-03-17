import { Router} from "express";    
import { getPendingPlayers,acceptPlayer,rejectPlayer,loginAdmin } from "../controllers/admin-controller.js";
import { verifyAdmin } from "../middlewares/auth-middleware.js";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);

adminRouter.get("/getPendingPlayers",verifyAdmin,getPendingPlayers);
adminRouter.patch("/acceptPlayer/:playerId",verifyAdmin,acceptPlayer);
adminRouter.patch("/rejectPlayer",verifyAdmin,rejectPlayer);

export default adminRouter;

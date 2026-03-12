import { Router} from "express";    
import { getPendingPlayers,acceptPlayer,rejectPlayer,loginAdmin } from "../controllers/admin-controller.js";
import { verifyAdmin } from "../middlewares/auth-middleware.js";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);

adminRouter.get("/getPendingPlayers",verifyAdmin,getPendingPlayers);
adminRouter.post("/acceptPlayer/:playerId",verifyAdmin,acceptPlayer);
adminRouter.post("/rejectPlayer/:playerId",verifyAdmin,rejectPlayer);

export default adminRouter;

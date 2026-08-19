import { Router} from "express";    
import { getPendingPlayers,acceptPlayer,rejectPlayer,loginAdmin,verifyAdmin,makeEveryonePending } from "../controllers/admin-controller.js";
import verifyJWT from "../middlewares/auth-middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import {
  deleteAttendance,
  getAdminAttendance,
  getMarkingState,
  markAttendance,
  updateAttendance,
} from "../controllers/attendance-controller.js";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/verify",verifyJWT,authorizeRoles("admin"),verifyAdmin)

adminRouter.get("/getPendingPlayers",verifyJWT,authorizeRoles('admin'),getPendingPlayers);
adminRouter.patch("/acceptPlayer/:playerId",verifyJWT,authorizeRoles('admin'),acceptPlayer);
adminRouter.patch("/rejectPlayer",verifyJWT,authorizeRoles('admin'),rejectPlayer);
adminRouter.patch("/makePending",verifyJWT,authorizeRoles('admin'),makeEveryonePending)

adminRouter.get("/attendance/marking-state", verifyJWT, authorizeRoles("admin"), getMarkingState);
adminRouter.post("/attendance", verifyJWT, authorizeRoles("admin"), markAttendance);
adminRouter.get("/attendance", verifyJWT, authorizeRoles("admin"), getAdminAttendance);
adminRouter.patch("/attendance/:id", verifyJWT, authorizeRoles("admin"), updateAttendance);
adminRouter.delete("/attendance/:id", verifyJWT, authorizeRoles("admin"), deleteAttendance);

export default adminRouter;

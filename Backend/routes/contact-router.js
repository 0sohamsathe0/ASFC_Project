import { Router } from "express";

import { createContact, getAllContacts } from "../controllers/contacts-controller.js";
import verifyJWT from "../middlewares/auth-middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const contactRouter = Router();

contactRouter.post("/contact", createContact);
contactRouter.get("/contacts", verifyJWT, authorizeRoles("admin"), getAllContacts);

export default contactRouter;

import { Router } from "express";
import { newContact } from "./controller/contact.controller";
import { verifyToken } from "../../middleware/verifyToken";

const contactRouter: Router = Router();

contactRouter.post("/", verifyToken, newContact);

export default contactRouter;

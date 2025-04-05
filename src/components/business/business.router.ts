import { Router } from "express";
import { getBusinessByFilter } from "./controller/business.controller";

const businessRouter: Router = Router();

businessRouter.get("/", getBusinessByFilter);

export default businessRouter;

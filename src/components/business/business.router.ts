import { Router } from "express";
import {
  getAllBusiness,
  getBusinessDetail,
  getTopBusiness,
} from "./controller/business.controller";

const businessRouter: Router = Router();

businessRouter.post("/get-business", getAllBusiness);
businessRouter.get("/get-business-by-id/:id", getBusinessDetail);
businessRouter.post("/get-top-business", getTopBusiness);

export default businessRouter;

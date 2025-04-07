import { Router } from "express";
import {
  getAllBusiness,
  getBusinessDetail,
  getTopBusiness,
  addNewBusiness,
} from "./controller/business.controller";
import { verifyToken } from "../../middleware/verifyToken";

const businessRouter: Router = Router();

businessRouter.post("/get-business", getAllBusiness);
businessRouter.get("/get-business-by-id/:id", verifyToken, getBusinessDetail);
businessRouter.post("/get-top-business", getTopBusiness);

businessRouter.post("/", verifyToken, addNewBusiness);

export default businessRouter;

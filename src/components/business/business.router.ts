import { Router } from "express";
import {
  getAllBusiness,
  getBusinessDetail,
  getTopBusiness,
  addNewBusiness,
} from "./controller/business.controller";
import { verifyToken } from "../../middleware/verifyToken";
import {
  newReviewBusiness,
  reviewsBusinessById,
} from "./controller/business-review.controller";

const businessRouter: Router = Router();

//pendientes
businessRouter.post("/get-business", getAllBusiness);
businessRouter.post("/get-top-business", getTopBusiness);
businessRouter.post("/review", newReviewBusiness);
businessRouter.get("/review/:businessId", reviewsBusinessById);
businessRouter.get("/get-business-by-id/:id", verifyToken, getBusinessDetail);

//Listos
businessRouter.post("/", verifyToken, addNewBusiness);

export default businessRouter;

import { Router } from "express";
import {
  getAllBusiness,
  getBusinessDetail,
  getTopBusiness,
} from "./controller/business.controller";
import {
  newReviewBusiness,
  reviewsBusinessById,
} from "./controller/business-review.controller";

const businessRouter: Router = Router();

businessRouter.post("/get-business", getAllBusiness);
businessRouter.get("/get-business-by-id/:id", getBusinessDetail);
businessRouter.post("/get-top-business", getTopBusiness);

businessRouter.post("/review", newReviewBusiness);
businessRouter.get("/review/:businessId", reviewsBusinessById);

export default businessRouter;

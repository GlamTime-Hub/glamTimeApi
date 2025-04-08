import { Router } from "express";
import {
  getAllBusiness,
  getBusinessDetail,
  getTopBusiness,
  addNewBusiness,
  getBusinessByUserId,
  updateBusinessImage,
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
businessRouter.post("/update-image", verifyToken, updateBusinessImage);
businessRouter.get(
  "/get-business-by-user-id",
  verifyToken,
  getBusinessByUserId
);

export default businessRouter;

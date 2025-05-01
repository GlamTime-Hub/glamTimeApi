import { Router } from "express";
import {
  getHomeBusiness,
  getBusinessDetail,
  getTopBusiness,
  addNewBusiness,
  getBusinessByUserId,
  updateBusinessImage,
  updateBusinessById,
  updateBusinessLocationById,
  handleBusinessStatusById,
  sendInvitationToProfessional,
  getHomeBusinessDetail,
} from "./controller/business.controller";
import { verifyToken } from "../../middleware/verifyToken";
import {
  newReviewBusiness,
  reviewsBusinessById,
} from "./controller/business-review.controller";

const businessRouter: Router = Router();

//pendientes
businessRouter.post("/get-top-business", getTopBusiness);
businessRouter.post("/review", verifyToken, newReviewBusiness);
businessRouter.get("/get-business-by-id/:id", verifyToken, getBusinessDetail);

//Listos
businessRouter.post("/", verifyToken, addNewBusiness);
businessRouter.post("/update-image", verifyToken, updateBusinessImage);
businessRouter.get(
  "/get-business-by-user-id",
  verifyToken,
  getBusinessByUserId
);
businessRouter.put("/:id", verifyToken, updateBusinessById);
businessRouter.put(
  "/update-location/:id",
  verifyToken,
  updateBusinessLocationById
);

businessRouter.put(
  "/send-invitation/:businessId",
  verifyToken,
  sendInvitationToProfessional
);

businessRouter.get("/reviews/:businessId", reviewsBusinessById);

businessRouter.post(
  "/handle-business-status",
  verifyToken,
  handleBusinessStatusById
);

businessRouter.post("/get-home-business", getHomeBusiness);

businessRouter.get("/get-home-business-detail/:id", getHomeBusinessDetail);

export default businessRouter;

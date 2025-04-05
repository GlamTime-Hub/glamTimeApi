import { Router } from "express";
import {
  newReviewProfessional,
  reviewsProfessionalById,
} from "./controller/reviewProfessional.controller";
import {
  newReviewBusiness,
  reviewsBusinessById,
} from "./controller/reviewBusiness.controller";

const reviewRouter: Router = Router();

// Professional

reviewRouter.post("/professional-add", newReviewProfessional);

reviewRouter.get("/professional/:professionalId", reviewsProfessionalById);

// Business

reviewRouter.post("/business-add", newReviewBusiness);

reviewRouter.get("/business/:businessId", reviewsBusinessById);

export default reviewRouter;

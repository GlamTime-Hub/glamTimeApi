import { Router } from "express";
import { getProfessionalByBusinessId } from "./controller/professional.controller";
import {
  newProfessionalReview,
  professionalReviewById,
} from "./controller/professional-review.controller";

const professionalRouter: Router = Router();

professionalRouter.get("/by-business/:businessId", getProfessionalByBusinessId);

professionalRouter.post("/review", newProfessionalReview);
professionalRouter.get("/review/:professionalId", professionalReviewById);

export default professionalRouter;

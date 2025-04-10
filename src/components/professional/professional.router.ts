import { Router } from "express";
import {
  deactivateProfessionalsByBusiness,
  getProfessionalByBusinessId,
  getProfessionalsByBusiness,
} from "./controller/professional.controller";
import {
  newProfessionalReview,
  professionalReviewById,
} from "./controller/professional-review.controller";
import { verifyToken } from "../../middleware/verifyToken";

const professionalRouter: Router = Router();

professionalRouter.get("/by-business/:businessId", getProfessionalByBusinessId);

professionalRouter.post("/review", verifyToken, newProfessionalReview);
professionalRouter.get("/review/:professionalId", professionalReviewById);

//listos
professionalRouter.get(
  "/get-professional-by-business-id/:businessId",
  getProfessionalsByBusiness
);

professionalRouter.post(
  "/deactivate-professional",
  deactivateProfessionalsByBusiness
);

export default professionalRouter;

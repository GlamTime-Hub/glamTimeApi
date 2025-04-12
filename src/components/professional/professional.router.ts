import { Router } from "express";
import {
  deactivateProfessionalsByBusiness,
  getProfessionalByBusinessId,
  getProfessionalsByBusiness,
  getProfessional,
  updateProfessional,
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
  verifyToken,
  getProfessionalsByBusiness
);

professionalRouter.post(
  "/deactivate-professional",
  verifyToken,
  deactivateProfessionalsByBusiness
);
professionalRouter.get(
  "/get-professional-by-id/:id",
  verifyToken,
  getProfessional
);
professionalRouter.post(
  "/update-professional",
  verifyToken,
  updateProfessional
);

export default professionalRouter;

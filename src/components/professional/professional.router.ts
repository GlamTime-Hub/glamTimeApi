import { Router } from "express";
import {
  deactivateProfessionalsByBusiness,
  getProfessionalByBusinessId,
  getAllProfessionalsByBusiness,
  getProfessional,
  updateProfessional,
  handleInvitationProfessional,
  handleWorkingHours,
} from "./controller/professional.controller";
import {
  newProfessionalReview,
  professionalReviewById,
} from "./controller/professional-review.controller";
import { verifyToken } from "../../middleware/verifyToken";

const professionalRouter: Router = Router();

professionalRouter.get("/by-business/:businessId", getProfessionalByBusinessId);

professionalRouter.post("/review", verifyToken, newProfessionalReview);
professionalRouter.get(
  "/review/:professionalId",
  verifyToken,
  professionalReviewById
);

//listos
professionalRouter.get(
  "/get-professional-by-business-id/:businessId",
  verifyToken,
  getAllProfessionalsByBusiness
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

professionalRouter.post(
  "/handle-invitation",
  verifyToken,
  handleInvitationProfessional
);

professionalRouter.post(
  "/handle-working-hours",
  verifyToken,
  handleWorkingHours
);

export default professionalRouter;

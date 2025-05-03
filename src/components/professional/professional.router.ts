import { Router } from "express";
import {
  deactivateProfessionalsByBusiness,
  getProfessionalByBusinessId,
  getAllProfessionalsByBusiness,
  getProfessional,
  updateProfessional,
  handleInvitationProfessional,
  handleWorkingHours,
  getProfessionalDetail,
  getBusinessByProfessionalByUserId,
} from "./controller/professional.controller";
import {
  newProfessionalReview,
  professionalReviewById,
} from "./controller/professional-review.controller";
import { verifyToken } from "../../middleware/verifyToken";

const professionalRouter: Router = Router();

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
  "/get-professional-by-id/:id/:businessId",
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

professionalRouter.get(
  "/professionals-by-business/:businessId",
  getProfessionalByBusinessId
);

professionalRouter.get(
  "/professional-detail/:id/:businessId",
  getProfessionalDetail
);

professionalRouter.get(
  "/business-by-professional",
  verifyToken,
  getBusinessByProfessionalByUserId
);

export default professionalRouter;

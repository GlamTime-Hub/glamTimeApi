import { Router } from "express";
import {
  deactivateProfessionalsByBusiness,
  getProfessionalByBusinessId,
  getAllProfessionalsByBusiness,
  getProfessional,
  updateProfessional,
  handleInvitationProfessional,
  getProfessionalDetail,
  getBusinessByProfessionalByUserId,
  getBusinessByProfessionalByProfessionalId,
  getAllProfessionalsWithActiveService,
  addLikeProfessional,
} from "./controller/professional.controller";
import {
  newProfessionalReview,
  professionalReviewByProfessionalId,
  professionalReviewByUserId,
} from "./controller/professional-review.controller";
import { verifyToken } from "../../middleware/verifyToken";
import {
  addNewProfessionalService,
  removeProfessionalService,
} from "./controller/professional-service.controller";

const professionalRouter: Router = Router();

//listos
professionalRouter.get(
  "/get-professional-by-business-id/:businessId/:useIsActive",
  verifyToken,
  getAllProfessionalsByBusiness
);

professionalRouter.get(
  "/get-professional-with-active-service/:businessId/:serviceId",
  verifyToken,
  getAllProfessionalsWithActiveService
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

professionalRouter.get(
  "/business-by-professional-id/:professionalId",
  verifyToken,
  getBusinessByProfessionalByProfessionalId
);

professionalRouter.post("/review", verifyToken, newProfessionalReview);

professionalRouter.get(
  "/review/:userId",
  verifyToken,
  professionalReviewByUserId
);

professionalRouter.get(
  "/review-by-professional-id/:professionalId",
  verifyToken,
  professionalReviewByProfessionalId
);

professionalRouter.post("/add-service", verifyToken, addNewProfessionalService);

professionalRouter.delete(
  "/delete-service/:service",
  verifyToken,
  removeProfessionalService
);

professionalRouter.post("/add-like", verifyToken, addLikeProfessional);

export default professionalRouter;

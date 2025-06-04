import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getServicesByBusiness,
  activeService,
  updateServiceById,
  getServicesByProfessionalAndService,
} from "./controller/service.controller";

const serviceRouter: Router = Router();

serviceRouter.post("/get-services-by-business", getServicesByBusiness);

serviceRouter.post("/active-service-by-business", verifyToken, activeService);

serviceRouter.post("/update-service-by-id", verifyToken, updateServiceById);

serviceRouter.post(
  "/services-by-professional-and-business",
  getServicesByProfessionalAndService
);

export default serviceRouter;

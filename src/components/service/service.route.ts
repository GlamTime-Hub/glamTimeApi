import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getServicesByBusiness,
  activeService,
  updateServiceById,
} from "./controller/service.controller";

const serviceRouter: Router = Router();

serviceRouter.post(
  "/get-services-by-business",
  verifyToken,
  getServicesByBusiness
);

serviceRouter.post("/active-service-by-business", verifyToken, activeService);

serviceRouter.post("/update-service-by-id", verifyToken, updateServiceById);

export default serviceRouter;

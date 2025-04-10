import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  getServicesByBusiness,
  activeService,
} from "./controller/service.controller";

const serviceRouter: Router = Router();

serviceRouter.post(
  "/get-services-by-business",
  verifyToken,
  getServicesByBusiness
);

serviceRouter.post("/active-service-by-business", verifyToken, activeService);

export default serviceRouter;

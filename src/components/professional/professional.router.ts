import { Router } from "express";
import { getProfessionalByBusinessId } from "./controller/professional.controller";

const professionalRouter: Router = Router();

professionalRouter.get("/by-business/:businessId", getProfessionalByBusinessId);

export default professionalRouter;

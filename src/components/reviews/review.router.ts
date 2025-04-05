import { Router } from "express";
import {
  newReviewProfessional,
  reviewsProfessionalById,
} from "./controller/reviewProfessional.controller";

const reviewRouter: Router = Router();

reviewRouter.post("/professional-add", newReviewProfessional);

reviewRouter.get("/professional/:professionalId", reviewsProfessionalById);



export default reviewRouter;

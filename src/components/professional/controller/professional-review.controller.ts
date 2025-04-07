import { NextFunction, Request, Response } from "express";
import {
  createProfessionalReview,
  getProfessionalReviewById,
} from "../service/professional-review.service";

const newProfessionalReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await createProfessionalReview(req.body);

    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const professionalReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professionalId } = req.params;

    const reviews = await getProfessionalReviewById(professionalId);

    res.status(201).json({
      message: "successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export { newProfessionalReview, professionalReviewById };

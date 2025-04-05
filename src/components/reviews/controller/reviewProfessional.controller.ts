import { NextFunction, Request, Response } from "express";
import {
  createReviewProfessional,
  getReviewsProfessionalById,
} from "../service/reviewProfessional.service";

const newReviewProfessional = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await createReviewProfessional(req.body);

    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const reviewsProfessionalById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professionalId } = req.params;

    const reviews = await getReviewsProfessionalById(professionalId);

    res.status(201).json({
      message: "successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export { newReviewProfessional, reviewsProfessionalById };

import { NextFunction, Request, Response } from "express";
import {
  createProfessionalReview,
  getProfessionalReviewById,
} from "../service/professional-review.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";

const newProfessionalReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const newReview = {
      userAuthId: id,
      ...req.body,
    };

    const review = await createProfessionalReview(newReview);

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

    console.log("professionalId", professionalId);

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

import { NextFunction, Request, Response } from "express";
import {
  createBusinessReview,
  getBusinessReviewById,
} from "../service/business-review.service";

const newReviewBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await createBusinessReview(req.body);

    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const reviewsBusinessById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;

    const reviews = await getBusinessReviewById(businessId);

    res.status(201).json({
      message: "successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export { newReviewBusiness, reviewsBusinessById };

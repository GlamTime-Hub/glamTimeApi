import { NextFunction, Request, Response } from "express";
import { createReviewBusiness, getReviewsBusinessById } from "../service/reviewBusiness.service";


const newReviewBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await createReviewBusiness(req.body);

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

    const reviews = await getReviewsBusinessById(businessId);

    res.status(201).json({
      message: "successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export { newReviewBusiness, reviewsBusinessById };

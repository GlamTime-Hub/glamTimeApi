import { NextFunction, Request, Response } from "express";
import {
  createBusinessReview,
  getBusinessReviewById,
} from "../service/business-review.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import { markBookingAsBusinessReviewed } from "../../booking/service/booking.service";

const newReviewBusiness = async (
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

    const review = await createBusinessReview(newReview);

    const { bookingId } = newReview;

    await markBookingAsBusinessReviewed(bookingId);

    res.status(201).json({
      status: true,
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
      status: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export { newReviewBusiness, reviewsBusinessById };

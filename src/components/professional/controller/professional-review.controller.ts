import { NextFunction, Request, Response } from "express";
import {
  createProfessionalReview,
  getProfessionalReviewById,
  getProfessionalReviewByProfessionalId,
} from "../service/professional-review.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import { markBookingAsProfessionalReviewed } from "../../booking/service/booking.service";

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

    const { bookingId } = newReview;

    await markBookingAsProfessionalReviewed(bookingId);

    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const professionalReviewByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const reviews = await getProfessionalReviewById(userId);

    res.status(201).json({
      message: "successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const professionalReviewByProfessionalId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professionalId } = req.params;

    const reviews = await getProfessionalReviewByProfessionalId(professionalId);

    res.status(201).json({
      message: "successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export {
  newProfessionalReview,
  professionalReviewByUserId,
  professionalReviewByProfessionalId,
};

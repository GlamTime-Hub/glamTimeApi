import mongoose from "mongoose";
import { BusinessReview } from "../model/business-review.model";

const createBusinessReview = async (review: any) => {
  return await BusinessReview.create(review);
};

const getBusinessReviewById = async (businessId: string) => {
  return await BusinessReview.aggregate([
    {
      $match: {
        businessId: new mongoose.Types.ObjectId(businessId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        name: "$user.name",
        urlPhoto: "$user.urlPhoto",
        rating: 1,
        review: 1,
      },
    },
  ]);
};

export { createBusinessReview, getBusinessReviewById };

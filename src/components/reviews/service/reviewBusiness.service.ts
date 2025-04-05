import mongoose from "mongoose";
import { ReviewBusiness } from "../model/reviewBusiness.model";

const createReviewBusiness = async (review: any) => {
  return await ReviewBusiness.create(review);
};

const getReviewsBusinessById = async (businessId: string) => {
  return await ReviewBusiness.aggregate([
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
        comment: 1,
      },
    },
  ]);
};

export { createReviewBusiness, getReviewsBusinessById };

import mongoose from "mongoose";
import { ReviewProfessional } from "../model/reviewProfessional.model";

const createReviewProfessional = async (review: any) => {
  return await ReviewProfessional.create(review);
};

const getReviewsProfessionalById = async (professionalId: string) => {
  return await ReviewProfessional.aggregate([
    {
      $match: {
        professionalId: new mongoose.Types.ObjectId(professionalId),
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

export { createReviewProfessional, getReviewsProfessionalById };

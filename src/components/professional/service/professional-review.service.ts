import mongoose from "mongoose";
import { ProfessionalReview } from "../model/professional-review.model";
import { Professional } from "../model/professional.model";

const createProfessionalReview = async (review: any) => {
  return await ProfessionalReview.create(review);
};

const getProfessionalReviewById = async (professionalId: string) => {
  const profesional = await Professional.findOne({ user: professionalId })
    .lean()
    .exec();

  if (!profesional) {
    return [];
  }

  return await ProfessionalReview.aggregate([
    {
      $match: {
        professionalId: profesional!._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userAuthId",
        foreignField: "userAuthId",
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

const getProfessionalReviewByProfessionalId = async (
  professionalId: string
) => {
  return await ProfessionalReview.aggregate([
    {
      $match: {
        professionalId: new mongoose.Types.ObjectId(professionalId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userAuthId",
        foreignField: "userAuthId",
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

export {
  createProfessionalReview,
  getProfessionalReviewById,
  getProfessionalReviewByProfessionalId,
};

import mongoose from "mongoose";
import { Professional } from "../model/professional.model";

const getProfessional = async (businessId: string) => {
  return await Professional.aggregate([
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
        receivedComments: 1,
        rating: 1,
        likes: 1,
      },
    },
  ]);
};

export { getProfessional };

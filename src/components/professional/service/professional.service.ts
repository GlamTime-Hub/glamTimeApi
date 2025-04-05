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
      $project: {
        _id: 1,
        name: 1,
        receivedComments: 1,
        rating: 1,
        likes: 1,
      },
    },
  ]);
};

export { getProfessional };

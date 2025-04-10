import mongoose from "mongoose";
import { IProfessional, Professional } from "../model/professional.model";

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

const newProfessional = async (professional: IProfessional) => {
  return await Professional.create(professional);
};

const getProfessionalsByBusinessId = async (businessId: string) => {
  return await Professional.find({ businessId, status: true })
    .populate("user", "_id name email phoneNumber urlPhoto ")
    .lean()
    .exec();
};

const deactivateProfessional = async (
  professionalId: string,
  businessId: string
) => {
  return await Professional.findOneAndUpdate(
    { _id: professionalId, businessId },
    { status: false },
    {
      new: true,
    }
  ).lean();
};

export {
  getProfessional,
  newProfessional,
  getProfessionalsByBusinessId,
  deactivateProfessional,
};

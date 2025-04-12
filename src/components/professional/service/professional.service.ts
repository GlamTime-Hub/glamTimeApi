import mongoose from "mongoose";
import { IProfessional, Professional } from "../model/professional.model";

const getProfessionals = async (businessId: string) => {
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
  return await Professional.find({ businessId, isActive: true })
    .populate("user", "_id name email phoneNumber urlPhoto")
    .lean()
    .exec();
};

const getProfessionalById = async (userId: string) => {
  return await Professional.find({ userAuthId: userId })
    .populate("user", "_id name email phoneNumber urlPhoto")
    .lean()
    .exec();
};

const updateProfessionalsById = async (userId: string, professional: any) => {
  const { _id, ...rest } = professional;
  return await Professional.findOneAndUpdate({ user: userId }, rest, {
    new: true,
  })
    .lean()
    .exec();
};

const deactivateProfessional = async (
  professionalId: string,
  businessId: string
) => {
  return await Professional.findOneAndUpdate(
    { _id: professionalId, businessId },
    { isActive: false },
    {
      new: true,
    }
  ).lean();
};

export {
  getProfessionals,
  newProfessional,
  getProfessionalsByBusinessId,
  deactivateProfessional,
  getProfessionalById,
  updateProfessionalsById,
};

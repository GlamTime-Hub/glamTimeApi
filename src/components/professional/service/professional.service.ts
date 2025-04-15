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

const getProfessionalsByBusinessId = async (
  businessId: string,
  useIsActive: boolean
) => {
  const query = useIsActive ? { businessId, isActive: true } : { businessId };

  return await Professional.find(query)
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

const handleInvitation = async (
  userId: string,
  businessId: string,
  invitationStatus: string
) => {
  if (invitationStatus === "invitation-accepted") {
    return await Professional.findOneAndUpdate(
      { user: userId, businessId },
      { invitationStatus, isActive: true, startWorking: new Date() }
    );
  }

  return await Professional.findOneAndDelete({ user: userId, businessId });
};

const updateWorkingHourStatus = async (
  professionalId: string,
  day: string,
  isActive: boolean
) => {
  const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  if (!validDays.includes(day)) {
    throw new Error("Día inválido. Debe ser uno de: " + validDays.join(", "));
  }

  const update: { [key: string]: any } = {};
  update[`workingHours.${day}.isActive`] = isActive;

  const result = await Professional.findByIdAndUpdate(
    professionalId,
    { $set: update },
    { new: true }
  );

  return result;
};

export {
  getProfessionals,
  newProfessional,
  getProfessionalsByBusinessId,
  deactivateProfessional,
  getProfessionalById,
  updateProfessionalsById,
  handleInvitation,
  updateWorkingHourStatus,
};

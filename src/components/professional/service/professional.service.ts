import mongoose from "mongoose";
import { IProfessional, Professional } from "../model/professional.model";

const getProfessionals = async (businessId: string) => {
  const match: any[] = [
    {
      $match: {
        businessId: new mongoose.Types.ObjectId(businessId),
        isActive: true,
        invitationStatus: "invitation-accepted",
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
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  match.push(
    {
      $lookup: {
        from: "professionalreviews",
        let: { professionalId: "$_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$professionalId", "$$professionalId"] } },
          },
          {
            $group: {
              _id: null,
              rating: { $avg: "$rating" },
              receivedReviews: { $sum: 1 },
            },
          },
        ],
        as: "reviewStats",
      },
    },
    {
      $lookup: {
        from: "professionallikes",
        let: { professionalId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$professionalId", "$$professionalId"] },
            },
          },
          {
            $group: {
              _id: null,
              totalLikes: { $sum: 1 },
            },
          },
        ],
        as: "likeStats",
      },
    },
    {
      $lookup: {
        from: "bookings",
        let: { professionalId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$professionalId", "$$professionalId"] },
            },
          },
          {
            $group: {
              _id: null,
              totalBookings: { $sum: 1 },
            },
          },
        ],
        as: "bookingStats",
      },
    },
    {
      $addFields: {
        rating: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.rating", 0] }, 0],
        },
        receivedReviews: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.receivedReviews", 0] }, 0],
        },
        likes: {
          $ifNull: [{ $arrayElemAt: ["$likeStats.totalLikes", 0] }, 0],
        },
        totalBooking: {
          $ifNull: [{ $arrayElemAt: ["$bookingStats.totalBookings", 0] }, 0],
        },
      },
    },
    {
      $project: {
        reviewStats: 0,
        services: 0,
        likeStats: 0,
        bookingStats: 0,
      },
    }
  );

  return await Professional.aggregate(match);
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

const getProfessionalDetailById = async (
  professionalId: string,
  businessId: string
) => {
  const match: any[] = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(professionalId),
        businessId: new mongoose.Types.ObjectId(businessId),
        isActive: true,
        invitationStatus: "invitation-accepted",
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
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  match.push(
    {
      $lookup: {
        from: "professionalreviews",
        let: { professionalId: "$_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$professionalId", "$$professionalId"] } },
          },
          {
            $group: {
              _id: null,
              rating: { $avg: "$rating" },
              receivedReviews: { $sum: 1 },
            },
          },
        ],
        as: "reviewStats",
      },
    },
    {
      $lookup: {
        from: "professionallikes",
        let: { professionalId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$professionalId", "$$professionalId"] },
            },
          },
          {
            $group: {
              _id: null,
              totalLikes: { $sum: 1 },
            },
          },
        ],
        as: "likeStats",
      },
    },
    {
      $lookup: {
        from: "bookings",
        let: { professionalId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$professionalId", "$$professionalId"] },
            },
          },
          {
            $group: {
              _id: null,
              totalBookings: { $sum: 1 },
            },
          },
        ],
        as: "bookingStats",
      },
    },
    {
      $addFields: {
        rating: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.rating", 0] }, 0],
        },
        receivedReviews: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.receivedReviews", 0] }, 0],
        },
        likes: {
          $ifNull: [{ $arrayElemAt: ["$likeStats.totalLikes", 0] }, 0],
        },
        totalBooking: {
          $ifNull: [{ $arrayElemAt: ["$bookingStats.totalBookings", 0] }, 0],
        },
      },
    },
    {
      $project: {
        reviewStats: 0,
        services: 0,
        likeStats: 0,
        bookingStats: 0,
      },
    }
  );

  return await Professional.aggregate(match);
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
  getProfessionalDetailById,
};

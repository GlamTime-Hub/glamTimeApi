import mongoose from "mongoose";
import { IProfessional, Professional } from "../model/professional.model";
import { ProfessionalLike } from "../model/professional-likes.model";

const getProfessionals = async (
  businessId: string,
  isActive: boolean = true,
  serviceId: string | null = null,
  useService: boolean = true
) => {
  const matchProfessionals = isActive
    ? { isActive, invitationStatus: "invitation-accepted" }
    : null;

  const match: any[] = [
    {
      $match: {
        businessId: new mongoose.Types.ObjectId(businessId),
        ...matchProfessionals,
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

  const conditions: any[] = [{ $eq: ["$professional", "$$professionalId"] }];

  if (serviceId) {
    conditions.push({
      $eq: ["$service", new mongoose.Types.ObjectId(serviceId)],
    });
  }

  //if true, it means we want to filter professionals with services
  if (useService) {
    match.push(
      {
        $lookup: {
          from: "professionalservices",
          let: { professionalId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: conditions,
                },
              },
            },
          ],
          as: "professionalServices",
        },
      },
      {
        $match: {
          $expr: { $gt: [{ $size: "$professionalServices" }, 0] },
        },
      }
    );
  }

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
              status: "completed",
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
  return await getProfessionals(businessId, useIsActive, null, false);
};

const getProfessionalsWithServices = async (
  businessId: string,
  serviceId: string
) => {
  return await getProfessionals(businessId, true, serviceId);
};

const getProfessionalById = async (userId: string, businessId: string) => {
  return await Professional.find({ userAuthId: userId, businessId })
    .populate("user", "_id name email phoneNumber urlPhoto")
    .lean()
    .exec();
};

const updateProfessionalsById = async (
  userId: string,
  professional: any,
  withoutBusiness = false
) => {
  const { _id, ...rest } = professional;

  if (withoutBusiness) {
    return await Professional.findOneAndUpdate({ user: userId }, rest, {
      new: true,
    })
      .lean()
      .exec();
  }

  return await Professional.findOneAndUpdate(
    { user: userId, businessId: rest.businessId },
    rest,
    {
      new: true,
    }
  )
    .lean()
    .exec();
};

const deactivateProfessional = async (
  professionalId: string,
  businessId: string
) => {
  return await Professional.findOneAndUpdate(
    { _id: professionalId, businessId },
    { isActive: false, businessId: null, invitationStatus: "" },
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
      { invitationStatus, isActive: true, startWorking: new Date() },
      {
        new: true,
      }
    );
  }

  return await Professional.findOneAndDelete({ user: userId, businessId });
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
              status: "completed",
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

const getBusinessByProfessional = async (userAuthId: string) => {
  const match: any[] = [
    {
      $match: {
        userAuthId,
      },
    },
    {
      $lookup: {
        from: "businesses",
        localField: "businessId",
        foreignField: "_id",
        as: "business",
      },
    },
    {
      $unwind: {
        path: "$business",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        workingHours: 1,
        userAuthId: 1,
        isActive: 1,
        createdAt: 1,
        business: 1,
        user: 1,
      },
    },
  ];

  return await Professional.aggregate(match);
};

const getProfessionalByProfessionalId = async (professionalId: string) => {
  return await Professional.find({ _id: professionalId })
    .populate("user", "_id name email phoneNumber urlPhoto")
    .lean()
    .exec();
};

const getProfessionalByUserId = async (userAuthId: string) => {
  return await Professional.findOne({ userAuthId }).lean().exec();
};

const likeProfessional = async (
  professionalId: string,
  userAuthId: string,
  userId: string
) => {
  const existingLike = await ProfessionalLike.findOne({
    professionalId,
    userAuthId,
    userId,
  });

  if (existingLike) {
    // If the like already exists, remove it
    return await ProfessionalLike.findOneAndDelete({
      professionalId,
      userAuthId,
      userId,
    });
  }

  return await ProfessionalLike.create({ professionalId, userAuthId, userId });
};

const getProfessionalFavorites = async (userAuthId: string) => {
  const match: any[] = [];

  match.push(
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
    {
      $lookup: {
        from: "professionallikes",
        let: { professionalId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$professionalId", "$$professionalId"] },
                  { $eq: ["$userAuthId", userAuthId] },
                ],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "likedByUser",
      },
    },
    { $match: { likedByUser: { $ne: [] } } },
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
              status: "completed",
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
  getProfessionalDetailById,
  getBusinessByProfessional,
  getProfessionalByProfessionalId,
  getProfessionalByUserId,
  getProfessionalsWithServices,
  likeProfessional,
  getProfessionalFavorites,
};

import mongoose from "mongoose";
import { Business, IBusiness } from "../model/business.model";

const getBusiness = async (
  filter: {
    name?: string;
    city?: string;
    category?: string;
    businessType?: string;
  },
  latitude: number,
  longitude: number,
  radius: number,
  page: number = 1,
  limit: number = 10
) => {
  const matchStages: any[] = [];

  if (filter.name) {
    matchStages.push({
      $match: {
        name: { $regex: filter.name, $options: "i" },
      },
    });
  }

  if (filter.city) {
    matchStages.push({
      $match: {
        city: new mongoose.Types.ObjectId(filter.city),
      },
    });
  }

  if (latitude && longitude && radius) {
    const radiusInDegrees = radius / 111.32;
    matchStages.push({
      $match: {
        "location.latitude": {
          $gte: latitude - radiusInDegrees,
          $lte: latitude + radiusInDegrees,
        },
        "location.longitude": {
          $gte: longitude - radiusInDegrees,
          $lte: longitude + radiusInDegrees,
        },
      },
    });
  }

  if (filter.category || filter.businessType) {
    matchStages.push(
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "business",
          as: "services",
        },
      },
      {
        $match: {
          ...(filter.category && {
            "services.category": new mongoose.Types.ObjectId(filter.category),
          }),
          ...(filter.businessType && {
            "services.subCategory": new mongoose.Types.ObjectId(
              filter.businessType
            ),
          }),
        },
      }
    );
  }

  matchStages.push(
    {
      $lookup: {
        from: "businessreviews",
        let: { businessId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$businessId", "$$businessId"] } } },
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
        from: "businesslikes",
        let: { businessId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$businessId", "$$businessId"] },
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
      },
    },
    {
      $project: {
        reviewStats: 0,
        services: 0,
        likeStats: 0,
      },
    }
  );

  const skip = (page - 1) * limit;
  matchStages.push({ $skip: skip }, { $limit: limit });

  return await Business.aggregate(matchStages);
};

const getTopBusinessesByLocation = async (
  latitude: number,
  longitude: number,
  radius: number,
  page: number = 1,
  limit: number = 10
) => {
  const radiusInDegrees = radius / 111.32;

  return await Business.aggregate([
    {
      $match: {
        "location.latitude": {
          $gte: latitude - radiusInDegrees,
          $lte: latitude + radiusInDegrees,
        },
        "location.longitude": {
          $gte: longitude - radiusInDegrees,
          $lte: longitude + radiusInDegrees,
        },
      },
    },
    {
      $lookup: {
        from: "businessreviews",
        let: { businessId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$businessId", "$$businessId"] } } },
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
      $addFields: {
        rating: { $ifNull: [{ $arrayElemAt: ["$reviewStats.rating", 0] }, 0] },
        receivedReviews: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.receivedReviews", 0] }, 0],
        },
      },
    },
    {
      $project: {
        reviewStats: 0,
      },
    },
    {
      $sort: {
        likes: -1,
        rating: -1,
        receivedReviews: -1,
      },
    },
    {
      $skip: (page - 1) * limit,
      $limit: limit,
    },
  ]);
};

const getBusinessById = async (id: string) => {
  return await Business.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "businessreviews",
        let: { businessId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$businessId", "$$businessId"] } } },
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
      $addFields: {
        rating: { $ifNull: [{ $arrayElemAt: ["$reviewStats.rating", 0] }, 0] },
        receivedReviews: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.receivedReviews", 0] }, 0],
        },
      },
    },
    {
      $project: {
        reviewStats: 0,
      },
    },
  ]);
};

const getBusinessByUserAuthId = async (userAuthId: string) => {
  const match: any[] = [];

  match.push({
    $match: {
      userAuthId,
    },
  });

  match.push(
    {
      $lookup: {
        from: "businessreviews",
        let: { businessId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$businessId", "$$businessId"] } } },
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
        from: "businesslikes",
        let: { businessId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$businessId", "$$businessId"] },
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
      },
    },
    {
      $project: {
        reviewStats: 0,
        likeStats: 0,
      },
    }
  );

  return await Business.aggregate(match);
};

const newBusiness = async (business: IBusiness) => {
  return Business.create(business);
};

const updateBusinessImageProfile = async (
  businessId: string,
  urlPhoto: string
) => {
  return await Business.findOneAndUpdate(
    { _id: businessId },
    {
      urlPhoto,
    },
    {
      new: true,
    }
  ).lean();
};

const updateBusiness = async (business: IBusiness) => {
  return await Business.findOneAndUpdate({ _id: business._id }, business, {
    new: true,
  }).lean();
};

const updateBusinessLocation = async (businessId: string, location: any) => {
  return await Business.findOneAndUpdate(
    { _id: businessId },
    { location },
    {
      new: true,
    }
  ).lean();
};

const handleBusinessStatus = async (businessId: string, isActive: boolean) => {
  return await Business.findOneAndUpdate(
    { _id: businessId },
    { isActive },
    {
      new: true,
    }
  ).lean();
};

export {
  getBusiness,
  getTopBusinessesByLocation,
  getBusinessById,
  newBusiness,
  getBusinessByUserAuthId,
  updateBusinessImageProfile,
  updateBusiness,
  updateBusinessLocation,
  handleBusinessStatus,
};

import mongoose from "mongoose";
import { Business, IBusiness } from "../model/business.model";

const getBusiness = async (
  name: string,
  latitude: number,
  longitude: number,
  radius: number,
  page: number = 1,
  limit: number = 10
) => {
  const match: any[] = [];

  const skip = (page - 1) * limit;

  if (name) {
    match.push({
      $match: {
        name: { $regex: name, $options: "i" },
      },
    });
  }

  if (latitude && longitude) {
    const radiusInDegrees = radius / 111.32;

    match.push({
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
      $addFields: {
        rating: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.rating", 0] }, 0],
        },
        receivedReviews: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.receivedReviews", 0] }, 0],
        },
      },
    },
    {
      $project: {
        reviewStats: 0,
      },
    }
  );

  match.push({ $skip: skip }, { $limit: limit });

  return await Business.aggregate(match);
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
      $addFields: {
        rating: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.rating", 0] }, 0],
        },
        receivedReviews: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.receivedReviews", 0] }, 0],
        },
      },
    },
    {
      $project: {
        reviewStats: 0,
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

export {
  getBusiness,
  getTopBusinessesByLocation,
  getBusinessById,
  newBusiness,
  getBusinessByUserAuthId,
  updateBusinessImageProfile,
  updateBusiness,
  updateBusinessLocation,
};

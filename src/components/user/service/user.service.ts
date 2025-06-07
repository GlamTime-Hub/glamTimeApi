import { BusinessReview } from "../../business/model/business-review.model";
import { ProfessionalReview } from "../../professional/model/professional-review.model";
import { IUser, User } from "../model/user.model";

const getUserByPhoneNumber = async (
  phoneNumber: string,
  phoneNumberExtension: string
) => {
  const pipeline = [
    {
      $match: { phoneNumber, phoneNumberExtension },
    },
    {
      $lookup: {
        from: "businesslikes",
        let: { uid: "$_id", uauth: "$userAuthId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$userId", "$$uid"] },
                  { $eq: ["$userAuthId", "$$uauth"] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              businessIds: { $addToSet: "$businessId" },
            },
          },
        ],
        as: "businessLikes",
      },
    },
    {
      $lookup: {
        from: "professionallikes",
        let: { uid: "$_id", uauth: "$userAuthId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$userId", "$$uid"] },
                  { $eq: ["$userAuthId", "$$uauth"] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              professionalIds: { $addToSet: "$professionalId" },
            },
          },
        ],
        as: "professionalLikes",
      },
    },
    {
      $addFields: {
        likedBusinessIds: {
          $ifNull: [{ $arrayElemAt: ["$businessLikes.businessIds", 0] }, []],
        },
        likedProfessionalIds: {
          $ifNull: [
            { $arrayElemAt: ["$professionalLikes.professionalIds", 0] },
            [],
          ],
        },
      },
    },
    {
      $project: {
        businessLikes: 0,
        professionalLikes: 0,
      },
    },
  ];

  const result = await User.aggregate(pipeline);
  return result[0] || null; // porque es solo uno
};

const createUser = async (newUser: IUser) => {
  return await User.create(newUser);
};

const getUserById = async (userAuthId: string) => {
  return await User.findOne({ userAuthId }).lean().exec();
};

const updateUserById = async (user: Partial<IUser>) => {
  return await User.findOneAndUpdate({ userAuthId: user.userAuthId }, user, {
    new: true,
  }).lean();
};

const updateUserImageProfile = async (userAuthId: string, urlPhoto: string) => {
  return await User.findOneAndUpdate(
    { userAuthId: userAuthId },
    {
      urlPhoto,
    },
    {
      new: true,
    }
  ).lean();
};

const updateNotificationPreference = async (
  userAuthId: string,
  notificationPreference: any
) => {
  return await User.findOneAndUpdate(
    { userAuthId: userAuthId },
    {
      notificationPreference,
    },
    {
      new: true,
    }
  ).lean();
};

const getUserAllReviews = async (userAuthId: string) => {
  const professionalReviews = await ProfessionalReview.aggregate([
    { $match: { userAuthId } },
    {
      $lookup: {
        from: "professionals",
        localField: "professionalId",
        foreignField: "_id",
        as: "professional",
      },
    },
    { $unwind: "$professional" },
    {
      $lookup: {
        from: "users",
        localField: "professional.userAuthId",
        foreignField: "userAuthId",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        review: 1,
        rating: 1,
        name: "$user.name",
        photo: "$user.urlPhoto",
      },
    },
  ]);

  const businessReviews = await BusinessReview.aggregate([
    { $match: { userAuthId } },
    {
      $lookup: {
        from: "businesses",
        localField: "businessId",
        foreignField: "_id",
        as: "business",
      },
    },
    { $unwind: "$business" },
    {
      $project: {
        _id: 1,
        review: 1,
        rating: 1,
        name: "$business.name",
        photo: "$business.urlPhoto",
      },
    },
  ]);

  return [...professionalReviews, ...businessReviews];
};
const getUserByEmail = async (email: string) => {
  return await User.findOne({ email }).lean().exec();
};

const getUserByUserAuthId = async (userAuthId: string) => {
  return await User.findOne({ userAuthId }).lean().exec();
};

export {
  createUser,
  getUserById,
  updateUserById,
  updateUserImageProfile,
  updateNotificationPreference,
  getUserAllReviews,
  getUserByEmail,
  getUserByUserAuthId,
  getUserByPhoneNumber,
};

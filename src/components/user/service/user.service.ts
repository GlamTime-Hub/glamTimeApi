import { IUser, User } from "../model/user.model";

const existsUser = async (email: string) => {
  return await User.findOne({ email }).lean().exec();
};

const createUser = async (newUser: IUser) => {
  return await User.create(newUser);
};

const getUserById = async (userAuthId: string) => {
  return await User.findOne({ userAuthId }).lean().exec();
};

const updateUserById = async (user: IUser) => {
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

const getUserByEmail = async (email: string) => {
  return await User.findOne({ email }).lean().exec();
};

export {
  createUser,
  getUserById,
  existsUser,
  updateUserById,
  updateUserImageProfile,
  updateNotificationPreference,
  getUserByEmail,
};

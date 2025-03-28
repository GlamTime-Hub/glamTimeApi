import { User } from "../model/user.model";

const createUser = async (user: any) => {
  return await User.create(user);
};

const getUserById = async (userAuthId: string) => {
  return await User.findOne({ userAuthId }).lean().exec();
};

export { createUser, getUserById };

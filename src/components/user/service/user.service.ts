import { IUser, User } from "../model/user.model";

const createUser = async (newUser: IUser) => {
  const userExist = await User.findOne({ email: newUser.email }).lean().exec();

  if (userExist) {
    return { exists: true, user: userExist };
  }

  const user = await User.create(newUser);

  return { exists: false, user };
};

const getUserById = async (userAuthId: string) => {
  return await User.findOne({ userAuthId }).lean().exec();
};

export { createUser, getUserById };

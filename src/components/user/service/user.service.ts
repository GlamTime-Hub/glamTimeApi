import { User } from "../model/user.model";

const createUser = async (user: any) => {
  return await User.create(user);
};

export { createUser };

import { NextFunction, Request, Response } from "express";
import { createUser, getUserById } from "../service/user.service";

const newUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userAuthId } = req.params;
    
    const user = await getUserById(userAuthId);

    res.status(201).json({
      message: "User profile successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export { newUser, getUserProfile };

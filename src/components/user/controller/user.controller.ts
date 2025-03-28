import { NextFunction, Request, Response } from "express";
import { createUser } from "../service/user.service";

const newUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export { newUser };

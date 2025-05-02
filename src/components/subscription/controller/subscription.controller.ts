import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  addSubscription,
  getSubscriptionByUser,
} from "../service/subscription.service";

const addUserToPremium = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    await addSubscription(id);
    res.status(201).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const subscription = await getSubscriptionByUser(id);
    res.status(201).json({
      status: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export { addUserToPremium, getSubscriptionByUserId };

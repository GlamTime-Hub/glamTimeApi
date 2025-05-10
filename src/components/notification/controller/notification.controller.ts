import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  getNotificationByUser,
  getTotalNotificationByUser,
  markNotificationAsRead,
} from "../service/notification.service";

const getNotificationByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const notifications = await getNotificationByUser(id);

    res.status(201).json({
      status: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

const getTotalNotificationByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const total = await getTotalNotificationByUser(id);

    res.status(201).json({
      status: true,
      data: total.length > 0 ? total[0].totalUnread : 0,
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsReadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await markNotificationAsRead(id);

    res.status(201).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getNotificationByUserId,
  getTotalNotificationByUserId,
  markNotificationAsReadById,
};

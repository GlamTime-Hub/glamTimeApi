import mongoose from "mongoose";
import { Notification } from "../model/notification.model";

const newNotification = async (notification: any) => {
  return await Notification.create(notification);
};

const getNotificationByUser = async (userId: string) => {
  return await Notification.find({ userAuthId: userId })
    .populate("user", "name urlPhoto")
    .populate("business", "name urlPhoto")
    .lean()
    .exec();
};

const getTotalNotificationByUser = async (userAuthId: string) => {
  return await Notification.aggregate([
    {
      $match: {
        userAuthId,
        isRead: false,
      },
    },
    {
      $group: {
        _id: "$userAuthId",
        totalUnread: { $sum: 1 },
      },
    },
  ]);
};

export { newNotification, getNotificationByUser, getTotalNotificationByUser };

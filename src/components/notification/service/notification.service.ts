import { Notification } from "../model/notification.model";

const newNotification = async (notification: any) => {
  return await Notification.create(notification);
};

const getNotificationByUser = async (userAuthId: string) => {
  return await Notification.aggregate([
    {
      $match: { "to.userAuthId": userAuthId, isRead: false },
    },
    {
      $lookup: {
        from: "users",
        localField: "from.user",
        foreignField: "_id",
        as: "fromUser",
      },
    },
    {
      $unwind: "$fromUser",
    },
    {
      $lookup: {
        from: "users",
        localField: "to.user",
        foreignField: "_id",
        as: "toUser",
      },
    },
    {
      $unwind: "$toUser",
    },
    {
      $lookup: {
        from: "businesses",
        localField: "business",
        foreignField: "_id",
        as: "business",
      },
    },
    {
      $unwind: "$business",
    },
    {
      $project: {
        message: 1,
        type: 1,
        isRead: 1,
        createdAt: 1,
        readAt: 1,
        "fromUser._id": 1,
        "fromUser.name": 1,
        "fromUser.urlPhoto": 1,
        "fromUser.userAuthId": 1,
        "toUser._id": 1,
        "toUser.name": 1,
        "toUser.urlPhoto": 1,
        "toUser.userAuthId": 1,
        "business._id": 1,
        "business.name": 1,
        "business.urlPhoto": 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
};

const getTotalNotificationByUser = async (userAuthId: string) => {
  return await Notification.aggregate([
    {
      $match: {
        "to.userAuthId": userAuthId,
        isRead: false,
      },
    },
    {
      $group: {
        _id: "$to.userAuthId",
        totalUnread: { $sum: 1 },
      },
    },
  ]);
};

const markNotificationAsRead = async (notificationId: string) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

export {
  newNotification,
  getNotificationByUser,
  getTotalNotificationByUser,
  markNotificationAsRead,
};

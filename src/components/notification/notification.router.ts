import { Router } from "express";
import {
  getNotificationByUserId,
  getTotalNotificationByUserId,
} from "./controller/notification.controller";
import { verifyToken } from "../../middleware/verifyToken";

const notificationsRouter: Router = Router();

notificationsRouter.get(
  "/get-notification-by-user-id",
  verifyToken,
  getNotificationByUserId
);

notificationsRouter.get(
  "/get-total-notification-by-user-id",
  verifyToken,
  getTotalNotificationByUserId
);

export default notificationsRouter;

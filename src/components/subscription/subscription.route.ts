import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  addUserToPremium,
  getSubscriptionByUserId,
} from "./controller/subscription.controller";

const subscriptionRouter: Router = Router();

subscriptionRouter.get("/add-user-to-premium", verifyToken, addUserToPremium);

subscriptionRouter.get(
  "/get-subscription-by-user",
  verifyToken,
  getSubscriptionByUserId
);

export default subscriptionRouter;

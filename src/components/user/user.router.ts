import { Router } from "express";
import {
  newUser,
  getUserProfileById,
  updateUser,
  updateUserImage,
  updateNotificationUser,
  allUserReviews,
} from "./controller/user.controller";
import { verifyToken } from "../../middleware/verifyToken";

const userRouter: Router = Router();

userRouter.post("/", newUser);
userRouter.get("/", verifyToken, getUserProfileById);
userRouter.post("/update", verifyToken, updateUser);
userRouter.post("/update-image", verifyToken, updateUserImage);
userRouter.post("/update-notifications", verifyToken, updateNotificationUser);
userRouter.get("/reviews", verifyToken, allUserReviews);

export default userRouter;

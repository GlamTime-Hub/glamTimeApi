import { Router } from "express";
import { newUser, getUserProfile } from "./controller/user.controller";

const userRouter: Router = Router();

userRouter.post("/", newUser);

userRouter.get("/:userAuthId", getUserProfile);

export default userRouter;

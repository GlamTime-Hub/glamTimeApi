import { Router } from "express";
import { newUser, getUserProfileById } from "./controller/user.controller";

const userRouter: Router = Router();

userRouter.post("/", newUser);

userRouter.get("/", getUserProfileById);

export default userRouter;

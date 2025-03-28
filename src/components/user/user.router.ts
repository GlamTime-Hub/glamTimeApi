import { Router } from "express";
import { newUser } from "./controller/user.controller";

const userRouter: Router = Router();

userRouter.post("/add", newUser);

export default userRouter;

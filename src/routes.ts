import express, { Router } from "express";
import userRouter from "./components/user/user.router";
import businessRouter from "./components/business/business.router";

const routes: Router = express.Router();
routes.use("/users", userRouter);
routes.use("/businesses", businessRouter);

export default routes;

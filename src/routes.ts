import express, { Router } from "express";
import userRouter from "./components/user/user.router";

const routes: Router = express.Router();
routes.use("/users", userRouter);

export default routes;

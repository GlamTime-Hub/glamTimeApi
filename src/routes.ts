import express, { Router } from "express";
import userRouter from "./components/user/user.router";
import locationRouter from "./components/location/location.router";
import businessRouter from "./components/business/business.router";
import professionalRouter from "./components/professional/professional.router";

const routes: Router = express.Router();
routes.use("/user", userRouter);
routes.use("/location", locationRouter);
routes.use("/business", businessRouter);
routes.use("/professional", professionalRouter);

export default routes;

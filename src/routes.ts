import express, { Router } from "express";
import userRouter from "./components/user/user.router";
import locationRouter from "./components/location/location.router";
import businessRouter from "./components/business/business.router";
import professionalRouter from "./components/professional/professional.router";
import utilRouter from "./components/util/util.router";

const routes: Router = express.Router();
routes.use("/user", userRouter);
routes.use("/location", locationRouter);
routes.use("/business", businessRouter);
routes.use("/professional", professionalRouter);
routes.use("/util", utilRouter);

export default routes;

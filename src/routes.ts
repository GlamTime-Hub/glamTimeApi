import express, { Router } from "express";
import userRouter from "./components/user/user.router";
import businessRouter from "./components/business/business.router";
import professionalRouter from "./components/professional/professional.router";
import reviewRouter from "./components/reviews/review.router";

const routes: Router = express.Router();
routes.use("/users", userRouter);
routes.use("/businesses", businessRouter);
routes.use("/professionals", professionalRouter);
routes.use("/reviews", reviewRouter);

export default routes;

import express, { Router } from "express";
import userRouter from "./components/user/user.router";
import locationRouter from "./components/location/location.router";
import businessRouter from "./components/business/business.router";
import professionalRouter from "./components/professional/professional.router";
import serviceRouter from "./components/service/service.route";
import utilRouter from "./components/util/util.router";
import notificationsRouter from "./components/notification/notification.router";
import contactRouter from "./components/contact/contact.router";

const routes: Router = express.Router();
routes.use("/user", userRouter);
routes.use("/location", locationRouter);
routes.use("/business", businessRouter);
routes.use("/professional", professionalRouter);
routes.use("/services", serviceRouter);
routes.use("/util", utilRouter);
routes.use("/notification", notificationsRouter);
routes.use("/contact", contactRouter);

export default routes;

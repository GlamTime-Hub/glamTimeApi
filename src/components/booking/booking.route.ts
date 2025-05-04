import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  addNewBooking,
  getBookingsByUser,
} from "./controller/booking.controller";

const bookingRouter: Router = Router();

bookingRouter.post("/add-new-booking", verifyToken, addNewBooking);

bookingRouter.get("/bookings-by-user", verifyToken, getBookingsByUser);

export default bookingRouter;

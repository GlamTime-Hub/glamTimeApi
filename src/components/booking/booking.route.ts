import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  addNewBooking,
  getBookingsByUser,
  cancelBookingByProfessional,
  getBookingsByProfessional,
  cancelBookingByUser,
  getAllBookingByProfessional,
  getSlots,
} from "./controller/booking.controller";

const bookingRouter: Router = Router();

bookingRouter.post("/add-new-booking", verifyToken, addNewBooking);

bookingRouter.get("/bookings-by-user", verifyToken, getBookingsByUser);

bookingRouter.get(
  "/bookings-by-professional-user-auth",
  verifyToken,
  getAllBookingByProfessional
);

bookingRouter.get(
  "/bookings-by-professional-id/:professionalId/:businessId",
  getBookingsByProfessional
);

bookingRouter.post("/cancel-booking", verifyToken, cancelBookingByProfessional);

bookingRouter.post("/cancel-booking-by-user", verifyToken, cancelBookingByUser);

bookingRouter.post("/get-slots", getSlots);

export default bookingRouter;

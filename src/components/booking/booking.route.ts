import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  addNewBooking,
  getBookingsByUser,
  cancelBookingByUser,
  confirmBookingByUser,
  getBookingsByProfessional,
} from "./controller/booking.controller";

const bookingRouter: Router = Router();

bookingRouter.post("/add-new-booking", verifyToken, addNewBooking);

bookingRouter.get("/bookings-by-user", verifyToken, getBookingsByUser);

bookingRouter.get(
  "/bookings-by-professional-id/:professionalId/:businessId",
  getBookingsByProfessional
);

bookingRouter.get(
  "/cancel-booking/:bookingId",
  verifyToken,
  cancelBookingByUser
);

bookingRouter.post("/confirm-booking", verifyToken, confirmBookingByUser);

export default bookingRouter;

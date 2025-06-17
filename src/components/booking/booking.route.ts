import { Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import {
  addNewBooking,
  getBookingsByUser,
  cancelBookingByProfessional,
  completeBookingByProfessional,
  getBookingsByProfessional,
  cancelBookingByUser,
  getAllBookingByProfessional,
  getSlots,
  getBookingHistoryDetailsByBookingId,
} from "./controller/booking.controller";

const bookingRouter: Router = Router();

bookingRouter.post("/add-new-booking", verifyToken, addNewBooking);

bookingRouter.post("/bookings-by-user", verifyToken, getBookingsByUser);

bookingRouter.post(
  "/bookings-by-professional-user-auth",
  verifyToken,
  getAllBookingByProfessional
);

bookingRouter.get(
  "/bookings-by-professional-id/:professionalId/:businessId",
  getBookingsByProfessional
);

bookingRouter.post(
  "/cancel-booking-by-professional",
  verifyToken,
  cancelBookingByProfessional
);

bookingRouter.post("/cancel-booking-by-user", verifyToken, cancelBookingByUser);

bookingRouter.post("/get-slots", getSlots);

bookingRouter.get(
  "/complete-booking/:bookingId",
  verifyToken,
  completeBookingByProfessional
);

bookingRouter.get(
  "/get-booking-history-detail/:bookingId",
  verifyToken,
  getBookingHistoryDetailsByBookingId
);

export default bookingRouter;

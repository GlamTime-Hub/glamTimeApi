import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  checkIfExistBooking,
  newBooking,
  getBookingByUserAuthId,
  getBookingByProfessionalId,
  cancelBooking,
  confirmBooking,
} from "../service/booking.service";
import { IBooking } from "../model/booking.model";
import {
  markNotificationAsRead,
  newNotification,
} from "../../notification/service/notification.service";

const addNewBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const { booking } = req.body;

    const bookingUpdate = {
      ...booking,
      userAuthId: id,
    } as IBooking;

    const exists = await checkIfExistBooking(bookingUpdate);

    if (!exists) {
      const booking = await newBooking(bookingUpdate);

      const notificationProfessional = {
        title: "Nueva Reserva",
        body: "Tienes una nueva reserva, ve al detalle de la reserva para más información.",
        to: {
          user: booking.professionalUserId,
          userAuthId: booking.professionalUserAuthId,
        },
        from: {
          userAuthId: id,
          user: booking.userId,
        },
        type: "professional-booking",
        meta: {
          business: booking.businessId,
          professional: booking.professionalId,
          booking: booking._id,
        },
      };

      await newNotification(notificationProfessional);

      res.status(201).json({
        status: 200,
      });
      return;
    }

    res.status(409).json({
      status: 409,
    });
  } catch (error) {
    next(error);
  }
};

const getBookingsByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const bookings = await getBookingByUserAuthId(id);
    res.status(201).json({
      status: 200,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const cancelBookingByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    await cancelBooking(bookingId, reason);
    res.status(201).json({
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const confirmBookingByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, notificationId, to, from, business, professional } =
      req.body;

    await confirmBooking(bookingId, "Reserva confirmada por el profesional");

    await markNotificationAsRead(notificationId);

    const notification = {
      title: "Reserva Confirmada",
      body: "Tu reserva ha sido confirmada por el profesional.",
      to: {
        user: to.user,
        userAuthId: to.userAuthId,
      },
      from: {
        userAuthId: from.userAuthId,
        user: from.user,
      },
      type: "booking-confirmed",
      meta: {
        business,
        professional,
        booking: bookingId,
      },
    };

    await newNotification(notification);

    res.status(201).json({
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const getBookingsByProfessional = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professionalId, businessId } = req.params;

    const bookings = await getBookingByProfessionalId(
      professionalId,
      businessId
    );
    res.status(201).json({
      status: 200,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addNewBooking,
  getBookingsByUser,
  cancelBookingByUser,
  getBookingsByProfessional,
  confirmBookingByUser,
};

import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  checkIfExistBooking,
  newBooking,
  getBookingByUserAuthId,
  getBookingByProfessionalId,
  cancelBooking,
  getAllBookingByProfessionalId,
} from "../service/booking.service";
import { IBooking } from "../model/booking.model";
import {
  markNotificationAsRead,
  newNotification,
} from "../../notification/service/notification.service";
import { Slot } from "../model/slot.model";
import { formatDate } from "../../../util/format-date.util";

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

const cancelBookingByProfessional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, notificationId, to, from, business, professional } =
      req.body;

    await cancelBooking(bookingId, "Reserva cancelada por el profesional");

    await markNotificationAsRead(notificationId);

    const notification = {
      title: "Reserva Cancelada",
      body: "Tu reserva ha sido cancelada por el profesional.",
      to: {
        user: to.user,
        userAuthId: to.userAuthId,
      },
      from: {
        userAuthId: from.userAuthId,
        user: from.user,
      },
      type: "booking-cancelled",
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

const cancelBookingByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, to, from, business, professional } = req.body;

    await cancelBooking(bookingId, "Reserva cancelada por el usuario.");

    const notification = {
      title: "Reserva Cancelada",
      body: "Tu reserva ha sido cancelada por el usuario.",
      to: {
        user: to.user,
        userAuthId: to.userAuthId,
      },
      from: {
        userAuthId: from.userAuthId,
        user: from.user,
      },
      type: "booking-cancelled",
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

const getAllBookingByProfessional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const bookings = await getAllBookingByProfessionalId(id);

    res.status(201).json({
      status: 200,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const getSlots = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professional, service, slotDate } = req.body;

    //get bookings
    const { id: professionalId, businessId } = professional;

    const bookings = await getBookingByProfessionalId(
      professionalId,
      businessId
    );

    const slots = buildSlots(professional, service, slotDate, bookings);

    res.status(201).json({
      status: 200,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

const buildSlots = (
  professional: any,
  service: any | null,
  startDate = new Date(),
  currentBookings: any[] = []
): Slot[] => {
  const dayOfWeek = new Date(startDate)
    .toLocaleString("en-us", { weekday: "long" })
    .toLowerCase() as
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";

  const date = formatDate(startDate);

  const workingHours = professional?.workingHours[dayOfWeek];

  if (!workingHours) {
    return []; // Si el profesional no trabaja ese día, no hay turnos disponibles
  }

  const slots: Slot[] = [];

  const serviceDuration =
    (service?.service && service?.service.duration / 60) || 0;
  const bookedAppointments = currentBookings
    .filter((b: any) => b.fullDate === date)
    .sort((a: any, b: any) => a.startTime - b.startTime);

  workingHours.forEach(({ start, end }: any) => {
    let currentTime = start;

    bookedAppointments.forEach((booking: any) => {
      let { startTime, endTime } = booking;
      if (currentTime + serviceDuration <= startTime) {
        slots.push({
          startTime: Math.floor(currentTime * 10) / 10,
          endTime: Math.floor((currentTime + serviceDuration) * 10) / 10,
          fullDate: formatDate(startDate),
          date: startDate,
          service: {
            subCategory: service?.id || "",
            name: service?.name || "",
            categoryId: service?.categoryId || "",
            price: service?.service?.price || 0,
            id: service?.service.id || "",
          },
          professional: {
            id: professional?.id,
            businessId: professional?.businessId,
          },
        });
      }
      currentTime = Math.max(currentTime, endTime);
    });

    while (currentTime + serviceDuration <= end) {
      slots.push({
        startTime: Math.floor(currentTime * 10) / 10,
        endTime: Math.floor((currentTime + serviceDuration) * 10) / 10,
        fullDate: formatDate(startDate),
        date: startDate,
        service: {
          subCategory: service?.id || "",
          name: service?.name || "",
          categoryId: service?.categoryId || "",
          price: service?.service?.price || 0,
          id: service?.service.id || "",
        },
        professional: {
          id: professional?.id,
          businessId: professional?.businessId,
        },
      });
      currentTime += serviceDuration;
    }
  });

  const currentDate = new Date();
  const currentFormatDate = formatDate(currentDate);
  const currentHour = currentDate.getHours() + currentDate.getMinutes() / 60;

  return slots.filter(
    (slot) =>
      (slot.fullDate === currentFormatDate && slot.startTime > currentHour) ||
      slot.fullDate !== currentFormatDate
  );
};

export {
  addNewBooking,
  getBookingsByUser,
  cancelBookingByProfessional,
  getBookingsByProfessional,
  getAllBookingByProfessional,
  cancelBookingByUser,
  getSlots,
};

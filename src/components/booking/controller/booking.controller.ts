import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  checkIfExistBooking,
  newBooking,
  getBookingByUserAuthId,
} from "../service/booking.service";
import { IBooking } from "../model/booking.model";

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

    console.log("exists", exists);

    if (!exists) {
      await newBooking(bookingUpdate);
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

export { addNewBooking, getBookingsByUser };

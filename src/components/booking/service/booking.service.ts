import { Booking, IBooking } from "../model/booking.model";

const newBooking = async (booking: IBooking) => {
  return await Booking.create(booking);
};

const checkIfExistBooking = async (booking: IBooking) => {
  return await Booking.findOne({
    professionalId: booking.professionalId,
    fullDate: booking.fullDate,
    startTime: booking.startTime,
    endTime: booking.endTime,
  });
};

const getBookingByUserAuthId = async (userAuthId: string) => {
  const match: any[] = [
    {
      $match: {
        userAuthId,
      },
    },
    {
      $lookup: {
        from: "professionals",
        localField: "professionalId",
        foreignField: "_id",
        as: "professionals",
      },
    },
    {
      $unwind: {
        path: "$professionals",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "professionals.user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "businesses",
        localField: "businessId",
        foreignField: "_id",
        as: "businesses",
      },
    },
    {
      $unwind: {
        path: "$businesses",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { createdAt: 1 } },
    {
      $project: {
        _id: 1,
        date: 1,
        fullDate: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        createdAt: 1,
        serviceId: 1,
        serviceName: 1,
        professional: {
          id: "$professionals._id",
          urlPhoto: "$user.urlPhoto",
          name: "$user.name",
        },
        business: {
          id: "$businesses._id",
          name: "$businesses.name",
          urlPhoto: "$businesses.urlPhoto",
        },
      },
    },
  ];

  return await Booking.aggregate(match);
};

export { newBooking, checkIfExistBooking, getBookingByUserAuthId };

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
          location: {
            lat: "$businesses.location.latitude",
            lng: "$businesses.location.longitude",
            address: "$businesses.location.address",
          },
        },
      },
    },
  ];

  return await Booking.aggregate(match);
};

const cancelBooking = async (bookingId: string, reason: string) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        status: "cancelled",
        reason,
      },
    },
    { new: true }
  );
};

const getBookingByProfessionalId = async (
  professionalId: string,
  businessId: string
) => {
  return await Booking.find({
    professionalId,
    businessId,
    status: { $in: ["pending", "confirmed"] },
  })
    .lean()
    .exec();
};

export {
  newBooking,
  checkIfExistBooking,
  getBookingByUserAuthId,
  getBookingByProfessionalId,
  cancelBooking,
};

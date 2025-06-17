import mongoose from "mongoose";
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
    status: { $in: ["confirmed"] },
  });
};

const getBookingByUserAuthId = async (
  userAuthId: string,
  page: number,
  limit: number,
  status: string
) => {
  const match: any[] = [
    {
      $match: {
        userAuthId,
        status: { $in: [status] },
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
        as: "userProfessional",
      },
    },
    {
      $unwind: { path: "$userProfessional", preserveNullAndEmptyArrays: true },
    },

    {
      $lookup: {
        from: "users",
        localField: "userId",
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
    { $sort: { date: -1 } },
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
        reason: 1,
        serviceName: 1,
        hasBusinessReview: 1,
        hasProfessionalReview: 1,
        professional: {
          id: "$professionals._id",
          userAuthId: "$userProfessional.userAuthId",
          userId: "$userProfessional._id",
          urlPhoto: "$userProfessional.urlPhoto",
          name: "$userProfessional.name",
        },
        user: {
          id: "$user._id",
          userAuthId: "$user.userAuthId",
          userId: "$user._id",
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

  const skip = (page - 1) * limit;
  match.push({ $skip: skip }, { $limit: limit });

  return await Booking.aggregate(match);
};

const cancelBooking = async (
  bookingId: string,
  status: string,
  reason: string
) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        status,
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
    status: { $in: ["confirmed"] },
  })
    .lean()
    .exec();
};

const getAllBookingByProfessionalId = async (
  professionalUserAuthId: string,
  page: number,
  limit: number,
  status: string
) => {
  const match: any[] = [
    {
      $match: {
        professionalUserAuthId,
        status: { $in: [status] },
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
        as: "userProfessional",
      },
    },
    {
      $unwind: { path: "$userProfessional", preserveNullAndEmptyArrays: true },
    },

    {
      $lookup: {
        from: "users",
        localField: "userId",
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
    { $sort: { date: -1 } },
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
        reason: 1,
        serviceName: 1,
        hasBusinessReview: 1,
        hasProfessionalReview: 1,
        professional: {
          id: "$professionals._id",
          userAuthId: "$userProfessional.userAuthId",
          userId: "$userProfessional._id",
          urlPhoto: "$userProfessional.urlPhoto",
          name: "$userProfessional.name",
        },
        user: {
          id: "$user._id",
          userAuthId: "$user.userAuthId",
          userId: "$user._id",
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

  const skip = (page - 1) * limit;
  match.push({ $skip: skip }, { $limit: limit });

  return await Booking.aggregate(match);
};

const markBookingAsBusinessReviewed = async (bookingId: string) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        hasBusinessReview: true,
      },
    },
    { new: true }
  );
};

const markBookingAsProfessionalReviewed = async (bookingId: string) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        hasProfessionalReview: true,
      },
    },
    { new: true }
  );
};

const completeBooking = async (bookingId: string) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        status: "completed",
      },
    },
    { new: true }
  );
};

const getBookingHistoryDetails = async (bookingId: string) => {
  const match: any[] = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(bookingId),
      },
    },

    {
      $lookup: {
        from: "businessreviews",
        localField: "_id",
        foreignField: "bookingId",
        as: "businessesReviews",
      },
    },
    {
      $unwind: {
        path: "$businessesReviews",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "professionalreviews",
        localField: "_id",
        foreignField: "bookingId",
        as: "professionalReviews",
      },
    },
    {
      $unwind: {
        path: "$professionalReviews",
        preserveNullAndEmptyArrays: true,
      },
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
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
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
        as: "userProfessional",
      },
    },
    {
      $unwind: { path: "$userProfessional", preserveNullAndEmptyArrays: true },
    },

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
        reason: 1,
        serviceName: 1,
        hasBusinessReview: 1,
        hasProfessionalReview: 1,
        professional: {
          id: "$professionals._id",
          userAuthId: "$userProfessional.userAuthId",
          userId: "$userProfessional._id",
          urlPhoto: "$userProfessional.urlPhoto",
          name: "$userProfessional.name",
        },
        user: {
          id: "$user._id",
          userAuthId: "$user.userAuthId",
          userId: "$user._id",
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
        professionalReview: {
          id: "$professionalReviews._id",
          rating: "$professionalReviews.rating",
          review: "$professionalReviews.review",
          createdAt: "$professionalReviews.createdAt",
        },
        businessReview: {
          id: "$businessesReviews._id",
          rating: "$businessesReviews.rating",
          review: "$businessesReviews.review",
          createdAt: "$businessesReviews.createdAt",
        },
      },
    },
  ];

  return await Booking.aggregate(match);
};

export {
  newBooking,
  checkIfExistBooking,
  getBookingByUserAuthId,
  getBookingByProfessionalId,
  cancelBooking,
  getAllBookingByProfessionalId,
  markBookingAsBusinessReviewed,
  markBookingAsProfessionalReviewed,
  completeBooking,
  getBookingHistoryDetails,
};

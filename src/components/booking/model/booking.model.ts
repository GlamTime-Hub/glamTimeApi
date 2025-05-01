import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  businessId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userAuthId: string;
  service: mongoose.Types.ObjectId;
  date: Date;
  startTime: number;
  endTime: number;
  status: string;
  createdAt: Date;
}

const bookingSchema: Schema = new Schema<IBooking>({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professional",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userAuthId: {
    type: String,
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

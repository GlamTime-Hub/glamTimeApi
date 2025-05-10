import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  businessId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  professionalUserAuthId: string;
  userId: mongoose.Types.ObjectId;
  userAuthId: string;
  serviceId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId: mongoose.Types.ObjectId;
  serviceName: string;
  fullDate: string;

  reason: string;
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
  professionalUserAuthId: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userAuthId: {
    type: String,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  serviceName: { type: String, required: true },
  reason: { type: String, required: false, default: null },
  fullDate: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

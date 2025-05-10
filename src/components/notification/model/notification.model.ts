import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  from: {
    user: mongoose.Types.ObjectId;
    userAuthId: string;
  };
  to: {
    user: mongoose.Types.ObjectId;
    userAuthId: string;
  };
  meta: {
    business: mongoose.Types.ObjectId;
    professional: mongoose.Types.ObjectId;
  };
  isRead: boolean;
  createdAt: Date;
  readAt: Date;
  title: string;
  body: string;
  type:
    | "invitation"
    | "professional-booking"
    | "invitation-accepted"
    | "booking-confirmed"
    | "invitation-rejected";
}

const notificationSchema: Schema = new Schema<INotification>({
  from: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userAuthId: { type: String, required: true },
  },
  to: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userAuthId: { type: String, required: true },
  },
  meta: {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: false,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: false,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "invitation",
      "invitation-accepted",
      "invitation-rejected",
      "professional-booking",
      "booking-confirmed",
    ],
    required: true,
  },
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  message: string;
  from: {
    user: mongoose.Types.ObjectId;
    userAuthId: string;
  };
  to: {
    user: mongoose.Types.ObjectId;
    userAuthId: string;
  };
  business: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  readAt: Date;
  type:
    | "invitation"
    | "invitation-accepted"
    | "invitation-rejected"
    | "reservation"
    | "reservation-accepted"
    | "reservation-rejected"
    | "review-received";
}

const notificationSchema: Schema = new Schema<INotification>({
  message: { type: String, required: true },
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
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null },
  type: {
    type: String,
    enum: [
      "invitation",
      "invitation-accepted",
      "invitation-rejected",
      "reservation",
      "reservation-accepted",
      "reservation-rejected",
      "review-received",
    ],
    required: true,
  },
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

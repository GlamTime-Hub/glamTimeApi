import mongoose, { Document, Schema } from "mongoose";

export interface IReviewBusiness extends Document {
  userId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewBusinessSchema: Schema = new Schema<IReviewBusiness>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReviewBusiness = mongoose.model<IReviewBusiness>(
  "ReviewBusiness",
  reviewBusinessSchema
);

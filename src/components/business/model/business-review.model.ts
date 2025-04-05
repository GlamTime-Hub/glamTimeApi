import mongoose, { Schema, Document } from "mongoose";

export interface IBusinessReview extends Document {
  businessId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
}

const businessReviewSchema: Schema = new Schema<IBusinessReview>({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const BusinessReview = mongoose.model<IBusinessReview>(
  "BusinessReview",
  businessReviewSchema
);

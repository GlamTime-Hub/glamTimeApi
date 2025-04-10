import mongoose, { Schema, Document } from "mongoose";

export interface IBusinessReview extends Document {
  businessId: mongoose.Types.ObjectId;
  userAuthId: string;
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
  userAuthId: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const BusinessReview = mongoose.model<IBusinessReview>(
  "BusinessReview",
  businessReviewSchema
);

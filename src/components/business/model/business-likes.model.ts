import mongoose, { Schema, Document } from "mongoose";

export interface IBusinessLike extends Document {
  businessId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const businessLikeSchema: Schema = new Schema<IBusinessLike>({
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
  createdAt: { type: Date, default: Date.now },
});

export const BusinessLike = mongoose.model<IBusinessLike>(
  "BusinessLike",
  businessLikeSchema
);

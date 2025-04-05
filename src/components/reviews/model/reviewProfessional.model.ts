import mongoose, { Document, Schema } from "mongoose";

export interface IReviewProfessional extends Document {
  userId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewProfessionalSchema: Schema = new Schema<IReviewProfessional>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReviewProfessional = mongoose.model<IReviewProfessional>(
  "ReviewProfessional",
  reviewProfessionalSchema
);

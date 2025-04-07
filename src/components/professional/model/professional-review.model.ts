import mongoose, { Document, Schema } from "mongoose";

export interface IProfessionalReview extends Document {
  userId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
}

const professionalReviewSchema: Schema = new Schema<IProfessionalReview>({
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
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ProfessionalReview = mongoose.model<IProfessionalReview>(
  "ProfessionalReview",
  professionalReviewSchema
);

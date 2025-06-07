import mongoose, { Schema, Document } from "mongoose";

export interface IProfessionalLike extends Document {
  professionalId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  userAuthId: string;
  createdAt: Date;
}

const professionalLikeSchema: Schema = new Schema<IProfessionalLike>({
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
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
  createdAt: { type: Date, default: Date.now },
});

export const ProfessionalLike = mongoose.model<IProfessionalLike>(
  "ProfessionalLike",
  professionalLikeSchema
);

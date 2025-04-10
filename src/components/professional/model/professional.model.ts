import mongoose, { Schema, Document } from "mongoose";

export interface IProfessional extends Document {
  userAuthId: string;
  businessId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  status: boolean;
  workingHours: {
    monday: { start: number; end: number };
    tuesday: { start: number; end: number };
    wednesday: { start: number; end: number };
    thursday: { start: number; end: number };
    friday: { start: number; end: number };
    saturday: { start: number; end: number };
  };
  invitationStatus: string;
  createdAt: Date;
}

const professionalSchema: Schema = new Schema<IProfessional>({
  userAuthId: { type: String, required: true },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: Boolean, required: false, default: true },
  invitationStatus: { type: String, required: false, default: "pending" },
  workingHours: {
    monday: {
      start: { type: Number, default: 0, required: false },
      end: { type: Number, default: 0, required: false },
    },
    tuesday: {
      start: { type: Number, default: 0, required: false },
      end: { type: Number, default: 0, required: false },
    },
    wednesday: {
      start: { type: Number, default: 0, required: false },
      end: { type: Number, default: 0, required: false },
    },
    thursday: {
      start: { type: Number, default: 0, required: false },
      end: { type: Number, default: 0, required: false },
    },
    friday: {
      start: { type: Number, default: 0, required: false },
      end: { type: Number, default: 0, required: false },
    },
    saturday: {
      start: { type: Number, default: 0, required: false },
      end: { type: Number, default: 0, required: false },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Professional = mongoose.model<IProfessional>(
  "Professional",
  professionalSchema
);

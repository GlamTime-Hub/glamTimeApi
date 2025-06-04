import mongoose, { Schema, Document } from "mongoose";

const timeBlockScheme = new Schema(
  {
    start: { type: Number, required: false },
    end: { type: Number, required: false },
  },
  { _id: false }
);

export interface IProfessional extends Document {
  userAuthId: string;
  businessId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  isActive: boolean;
  workingHours: {
    monday: { start: number; end: number }[];
    tuesday: { start: number; end: number }[];
    wednesday: { start: number; end: number }[];
    thursday: { start: number; end: number }[];
    friday: { start: number; end: number }[];
    saturday: { start: number; end: number }[];
  };
  invitationStatus: string;
  createdAt: Date;
  startWorking: Date;
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
  isActive: { type: Boolean, required: false, default: false },
  invitationStatus: { type: String, required: false, default: "pending" },
  workingHours: {
    monday: { type: [timeBlockScheme], default: [] },
    tuesday: { type: [timeBlockScheme], default: [] },
    wednesday: { type: [timeBlockScheme], default: [] },
    thursday: { type: [timeBlockScheme], default: [] },
    friday: { type: [timeBlockScheme], default: [] },
    saturday: { type: [timeBlockScheme], default: [] },
    sunday: { type: [timeBlockScheme], default: [] },
  },
  createdAt: { type: Date, default: Date.now, required: false },
});

export const Professional = mongoose.model<IProfessional>(
  "Professional",
  professionalSchema
);

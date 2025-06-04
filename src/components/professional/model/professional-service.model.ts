import mongoose, { Document, Schema } from "mongoose";

export interface IProfessionalService extends Document {
  professional: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;

  service: mongoose.Types.ObjectId;
  status: boolean;
  createdAt: Date;
}

const professionalServiceSchema: Schema = new Schema<IProfessionalService>({
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professional",
    required: true,
  },
  status: { type: Boolean, default: false },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const ProfessionalService = mongoose.model<IProfessionalService>(
  "ProfessionalService",
  professionalServiceSchema
);

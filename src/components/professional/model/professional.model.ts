import mongoose, { Document, Schema } from "mongoose";

interface DayHours {
  start: number;
  end: number;
}

interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
}

export interface IProfessional extends Document {
  userId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  status: string;
  rating: number;
  servicesId: mongoose.Types.ObjectId[];
  workingHours: WorkingHours;
  receivedComments: number;
  likes: number;
}

const dayHoursSchema = new Schema<DayHours>(
  {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
  },
  { _id: false }
);

const workingHoursSchema = new Schema<WorkingHours>(
  {
    monday: { type: dayHoursSchema, required: true },
    tuesday: { type: dayHoursSchema, required: true },
    wednesday: { type: dayHoursSchema, required: true },
    thursday: { type: dayHoursSchema, required: true },
    friday: { type: dayHoursSchema, required: true },
    saturday: { type: dayHoursSchema, required: true },
  },
  { _id: false }
);

const professionalSchema: Schema = new Schema<IProfessional>({
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
  status: { type: String, required: true },
  rating: { type: Number, required: true },
  servicesId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  ],
  workingHours: { type: workingHoursSchema, required: true },
  receivedComments: { type: Number, required: true },
  likes: { type: Number, required: true },
});

export const Professional = mongoose.model<IProfessional>(
  "Professional",
  professionalSchema
);

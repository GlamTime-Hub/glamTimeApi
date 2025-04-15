import mongoose, { Document, Schema } from "mongoose";

export interface IBusinessType extends Document {
  type: string;
}

const businessTypeSchema: Schema = new Schema<IBusinessType>({
  type: { type: String, required: true },
});

export const BusinesType = mongoose.model<IBusinessType>(
  "BusinessType",
  businessTypeSchema
);

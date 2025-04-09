import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  business: mongoose.Types.ObjectId;
  status: boolean;
  price: number;
  subCategory: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  duration: number;
  createdAt: Date;
}

const serviceSchema: Schema = new Schema<IService>({
  status: { type: Boolean, required: false, default: false },
  price: { type: Number, required: true },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Service = mongoose.model<IService>("Service", serviceSchema);

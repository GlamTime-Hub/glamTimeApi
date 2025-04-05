import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  status: string;
  price: number;
  subCategoryId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  duration: number;
}

const serviceSchema: Schema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  duration: { type: Number, required: true },
});

export const Service = mongoose.model<IService>("Service", serviceSchema);

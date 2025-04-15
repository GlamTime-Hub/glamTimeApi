import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  businesstype: mongoose.Schema.Types.ObjectId;
}

const categorySchema: Schema = new Schema<ICategory>({
  name: { type: String, required: true },
  businesstype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessType",
    required: true,
  },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);

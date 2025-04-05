import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema: Schema = new Schema<ICategory>({
  name: { type: String, required: true },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);

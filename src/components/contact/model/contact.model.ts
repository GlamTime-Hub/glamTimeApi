import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  userAuthId: string;
  subject: string;
  description: string;
}

const contactSchema: Schema = new Schema<IContact>({
  userAuthId: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
});

export const Contact = mongoose.model<IContact>("Contact", contactSchema);

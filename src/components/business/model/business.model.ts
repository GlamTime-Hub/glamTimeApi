import mongoose, { Document, Schema } from "mongoose";

export interface IBusiness extends Document {
  name: string;
  location: Record<string, unknown>;
  phoneNumber: string;
  country: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  receivedComments: number;
  likes: number;
  rating: number;
  email: string;
  urlPhoto: string;
  status: string;
}

const businessSchema: Schema = new Schema<IBusiness>({
  name: { type: String, required: true },
  location: { type: Object, required: true },
  phoneNumber: { type: String, required: true },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  receivedComments: { type: Number, required: true },
  likes: { type: Number, required: true },
  rating: { type: Number, required: true },
  email: { type: String, required: true },
  urlPhoto: { type: String, required: true },
  status: { type: String, required: true },
});

export const Business = mongoose.model<IBusiness>("Business", businessSchema);

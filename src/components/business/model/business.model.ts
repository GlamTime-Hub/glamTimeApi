import mongoose, { Schema, Document } from "mongoose";

export interface IBusiness extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  phoneNumber: string;
  phoneNumberExtension: string;
  email: string;
  country: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  isActive: boolean;
  likes: number;
  urlPhoto: string;
}

const businessSchema: Schema = new Schema<IBusiness>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    latitudeDelta: { type: Number, required: true },
    longitudeDelta: { type: Number, required: true },
  },
  phoneNumber: { type: String, required: true },
  phoneNumberExtension: { type: String, required: true },
  email: { type: String, required: true },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  isActive: { type: Boolean, default: true },
  likes: { type: Number, default: 0 },
  urlPhoto: { type: String, default: "" },
});

export const Business = mongoose.model<IBusiness>("Business", businessSchema);

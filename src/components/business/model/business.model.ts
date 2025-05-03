import mongoose, { Schema, Document } from "mongoose";

export interface IBusiness extends Document {
  userAuthId: string;
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
  businesstype: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  isActive: boolean;
  urlPhoto: string;
}

const businessSchema: Schema = new Schema<IBusiness>({
  userAuthId: { type: String, required: true },
  name: { type: String, required: true },
  location: {
    address: { type: String, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    latitudeDelta: { type: Number, required: false },
    longitudeDelta: { type: Number, required: false },
  },
  phoneNumber: { type: String, required: true },
  phoneNumberExtension: { type: String, required: true },
  email: { type: String, required: true },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  businesstype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessType",
    required: true,
  },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  isActive: { type: Boolean, default: true },
  urlPhoto: { type: String, default: "" },
});

export const Business = mongoose.model<IBusiness>("Business", businessSchema);

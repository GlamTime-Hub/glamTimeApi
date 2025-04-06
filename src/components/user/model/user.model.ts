import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userAuthId: string;
  name: string;
  urlPhoto: string;
  phoneNumber: string;
  phoneNumberExtension: string;
  email: string;
  country: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  gender: "male" | "female" | "non-binary";
  notificationPreference: {
    push: boolean;
  };
  role: "admin" | "user" | "professional";
  birthDay: number;
  birthMonth: number;
}

const userSchema: Schema = new Schema<IUser>({
  userAuthId: { type: String, required: true },
  name: { type: String, required: true },
  urlPhoto: { type: String, required: false, default: "" },
  phoneNumber: { type: String, required: true },
  phoneNumberExtension: { type: String, required: true },
  email: { type: String, required: true },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  gender: {
    type: String,
    enum: ["male", "female", "non-binary"],
    required: true,
  },
  notificationPreference: {
    push: { type: Boolean, default: true },
    news: { type: Boolean, default: true },
  },
  role: {
    type: String,
    enum: ["admin", "user", "professional"],
    required: true,
  },
  birthDay: { type: Number, required: true },
  birthMonth: { type: Number, required: true },
});

export const User = mongoose.model<IUser>("User", userSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userAuthId: string;
  name: string;
  phoneNumber: string;
  phoneNumberExtension: string;
  email: string;
  country: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  gender: "Male" | "Female" | "Non-binary";
  notificationPreference: Record<string, unknown>;
  role: "Admin" | "User";
  birthDay: Date;
}

const userSchema: Schema = new Schema<IUser>({
  userAuthId: { type: String, required: true },
  name: { type: String, required: true },
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
    enum: ["Male", "Female", "Non-binary"],
    required: true,
  },
  notificationPreference: { type: Object, required: true },
  role: { type: String, enum: ["Admin", "User"], required: true },
  birthDay: { type: Date, required: true },
});

export const User = mongoose.model<IUser>("User", userSchema);

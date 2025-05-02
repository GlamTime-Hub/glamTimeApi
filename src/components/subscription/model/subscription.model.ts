import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  userAuthId: string;
  active: boolean;
}

const subscriptionSchema: Schema = new Schema<ISubscription>({
  userAuthId: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
});

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

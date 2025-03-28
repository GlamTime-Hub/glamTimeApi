import mongoose, { Document, Schema } from "mongoose";

export interface ICity extends Document {
  name: string;
  countryId: mongoose.Types.ObjectId;
}

const citySchema: Schema = new Schema<ICity>({
  name: { type: String, required: true },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
});

export const City = mongoose.model<ICity>("City", citySchema);

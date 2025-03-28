import mongoose, { Document, Schema } from "mongoose";

export interface ICountry extends Document {
  name: string;
}

const countrySchema: Schema = new Schema<ICountry>({
  name: { type: String, required: true },
});

export const Country = mongoose.model<ICountry>("Country", countrySchema);

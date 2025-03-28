import "dotenv/config";
import mongoose from "mongoose";
import { City } from "../components/location/model/city.model";
import { Country } from "../components/location/model/country.model";

const MONGO_URL = process.env.DATABASE_URL || "";

const countriesData = [{ name: "México" }, { name: "Colombia" }];

const citiesData = [
  { name: "Ciudad de México", countryName: "México" },
  { name: "Guadalajara", countryName: "México" },
  { name: "Monterrey", countryName: "México" },

  { name: "Bogotá", countryName: "Colombia" },
  { name: "Medellín", countryName: "Colombia" },
  { name: "Barrancabermeja", countryName: "Colombia" },
];

export const loadInitialData = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000, 
    });

    await Country.deleteMany({});
    await City.deleteMany({});

    const countries = await Country.insertMany(countriesData);

    for (const city of citiesData) {
      const country = countries.find((c: any) => c.name === city.countryName);
      if (country) {
        await City.create({
          name: city.name,
          countryId: country._id,
        });
      }
    }

    process.exit(0); 
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

loadInitialData();

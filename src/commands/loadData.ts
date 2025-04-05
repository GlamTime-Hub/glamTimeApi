import "dotenv/config";
import mongoose from "mongoose";
import { loadCountryData } from "./countryData";
import { loadCategoryData } from "./categoryData";
import { loadBusinessData } from "./businessData";
import { loadServiceData } from "./servicesData";
import { loadProfessionalData } from "./professionalData";

const MONGO_URL = process.env.DATABASE_URL || "";

const loadData = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    // await Promise.all([loadCountryData(), loadCategoryData()]);

    // await loadBusinessData();

    // await loadServiceData()

    await loadProfessionalData()

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

loadData();

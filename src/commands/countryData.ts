import { City } from "../components/location/model/city.model";
import { Country } from "../components/location/model/country.model";

const countriesData = [{ name: "México" }, { name: "Colombia" }];

const citiesData = [
  { name: "Ciudad de México", countryName: "México" },
  { name: "Guadalajara", countryName: "México" },
  { name: "Monterrey", countryName: "México" },

  { name: "Bogotá", countryName: "Colombia" },
  { name: "Medellín", countryName: "Colombia" },
  { name: "Barrancabermeja", countryName: "Colombia" },
];

export const loadCountryData = async () => {
  try {
    await Promise.all([Country.deleteMany({}), City.deleteMany({})]);

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
  } catch (error) {
    console.error("Error:", error);
  }
};

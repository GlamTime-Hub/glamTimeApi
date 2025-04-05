import { City } from "../model/city.model";
import { Country } from "../model/country.model";

const getAllCountries = async () => {
  return await Country.find().lean().exec();
};

const getCitiesByCountryId = async (countryId: string) => {
  return await City.find({ countryId }).lean().exec();
};

export { getAllCountries, getCitiesByCountryId };

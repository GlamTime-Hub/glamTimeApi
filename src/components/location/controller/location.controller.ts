import { NextFunction, Response, Request } from "express";
import {
  getAllCountries,
  getCitiesByCountryId,
} from "../service/location.service";

const getCountries = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await getAllCountries();

    res.status(201).json({
      data: countries,
    });
  } catch (error) {
    next(error);
  }
};

const getCitiesByCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { countryId } = req.params;
    const cities = await getCitiesByCountryId(countryId);

    res.status(201).json({
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

export { getCountries, getCitiesByCountry };

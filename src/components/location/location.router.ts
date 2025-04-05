import { Router } from "express";
import {
  getCountries,
  getCitiesByCountry,
} from "./controller/location.controller";

const locationRouter: Router = Router();

locationRouter.get("/countries", getCountries);

locationRouter.get("/city-by-country/:countryId", getCitiesByCountry);

export default locationRouter;

import { Router } from "express";
import {
  getAllBusinessType,
  getCategories,
  getPrivacy,
  getSubcategoriesByCategory,
  getTerms,
  getCategoriesByBusinessType,
} from "./controller/util.controller";

const utilRouter: Router = Router();

utilRouter.get("/categories", getCategories);

utilRouter.get(
  "/subcategories-by-category/:categoryId",
  getSubcategoriesByCategory
);

utilRouter.get("/terms", getTerms);
utilRouter.get("/privacy", getPrivacy);
utilRouter.get("/business-types", getAllBusinessType);

utilRouter.get("/categories-by-business-type/:id", getCategoriesByBusinessType);

export default utilRouter;

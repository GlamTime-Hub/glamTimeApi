import { Router } from "express";
import {
  getAllBusinessType,
  getCategories,
  getPrivacy,
  getSubcategoriesByCategory,
  getTerms,
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

export default utilRouter;

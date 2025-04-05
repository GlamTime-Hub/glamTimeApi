import { Router } from "express";
import {
  getCategories,
  getSubcategoriesByCategory,
} from "./controller/util.controller";

const utilRouter: Router = Router();

utilRouter.get("/categories", getCategories);

utilRouter.get(
  "/subcategories-by-category/:categoryId",
  getSubcategoriesByCategory
);

export default utilRouter;

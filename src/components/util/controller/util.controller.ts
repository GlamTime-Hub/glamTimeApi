import { NextFunction, Response, Request } from "express";

import {
  getAllCategories,
  getSubcategoriesByCategoryId,
} from "../service/util.service";

const terms = require("../../../legal/terms.json");
const privacy = require("../../../legal/privacy.json");

const getCategories = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getAllCategories();

    res.status(201).json({
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getSubcategoriesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await getSubcategoriesByCategoryId(categoryId);

    res.status(201).json({
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

const getTerms = (_: Request, res: Response) => {
  res.status(200).json(terms);
};
const getPrivacy = (_: Request, res: Response) => {
  res.status(200).json(privacy);
};

export { getCategories, getSubcategoriesByCategory, getTerms, getPrivacy };

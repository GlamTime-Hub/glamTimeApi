import { NextFunction, Response, Request } from "express";

import {
  getAllCategories,
  getSubcategoriesByCategoryId,
} from "../service/util.service";

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

export { getCategories, getSubcategoriesByCategory };

import { NextFunction, Response, Request } from "express";

import {
  getAllCategories,
  getAllCategoriesByBusinessType,
  getBusinessTypes,
  getSubcategoriesByCategoryId,
} from "../service/util.service";

const terms = require("../../../legal/terms.json");
const privacy = require("../../../legal/privacy.json");

const getAllBusinessType = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const businessType = await getBusinessTypes();

    res.status(201).json({
      staus: true,
      data: businessType,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getAllCategories();

    res.status(201).json({
      staus: true,
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
      staus: true,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoriesByBusinessType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const categories = await getAllCategoriesByBusinessType(id);
    res.status(201).json({
      staus: true,
      data: categories,
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

export {
  getCategories,
  getSubcategoriesByCategory,
  getTerms,
  getPrivacy,
  getAllBusinessType,
  getCategoriesByBusinessType,
};

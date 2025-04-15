import { BusinesType } from "../model/business-type.model";
import { Category } from "../model/category.model";
import { SubCategory } from "../model/subCategory.model";

const getBusinessTypes = async () => {
  return await BusinesType.find().lean().exec();
};

const getAllCategories = async () => {
  return await Category.find().lean().exec();
};

const getSubcategoriesByCategoryId = async (categoryId: string) => {
  return await SubCategory.find({ categoryId }).lean().exec();
};

export { getAllCategories, getSubcategoriesByCategoryId, getBusinessTypes };

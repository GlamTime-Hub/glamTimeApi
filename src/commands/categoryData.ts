import { Category } from "../components/category/model/category.model";
import { SubCategory } from "../components/category/model/subCategory.model";

const categoriesData = [
  { name: "Cortes" },
  { name: "Depilaciòn facial" },
  { name: "Color cabello" },
];

const subCategoriesData = [
  { name: "Corte sencillo", categoryName: "Cortes" },
  { name: "Corte con barba", categoryName: "Cortes" },
  { name: "Barba", categoryName: "Cortes" },

  { name: "Diseño Cejas", categoryName: "Depilaciòn facial" },
  { name: "Depilación orejas", categoryName: "Depilaciòn facial" },

  { name: "Retoques de color", categoryName: "Color cabello" },
  { name: "Mechas", categoryName: "Color cabello" },
];

export const loadCategoryData = async () => {
  try {
    await Promise.all([SubCategory.deleteMany({}), Category.deleteMany({})]);

    const categories = await Category.insertMany(categoriesData);

    for (const subCat of subCategoriesData) {
      const category = categories.find((c) => c.name === subCat.categoryName);
      if (category) {
        await SubCategory.create({
          name: subCat.name,
          categoryId: category._id,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

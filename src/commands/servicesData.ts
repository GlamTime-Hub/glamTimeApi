import "dotenv/config";
import mongoose from "mongoose";

import { Category } from "../components/util/model/category.model";
import { SubCategory } from "../components/util/model/subCategory.model";
import { Service } from "../components/service/model/service.model";

const MONGO_URL = process.env.DATABASE_URL || "";

// Categorías
const categoriesData = [
  { name: "Cortes" },
  { name: "Peinados" },
  { name: "Color cabello" },
  { name: "Uñas" },
  { name: "Cejas" },
  { name: "Alisados" },
  { name: "Maquillaje" },
  { name: "Pestañas" },
  { name: "Extensiones de cabello" },
  { name: "Depilación facial" },
  { name: "Limpieza facial" },
];

// Subcategorías por categoría
const subCategoriesData = [
  // Cortes
  { name: "Corte clásico hombre", categoryName: "Cortes" },
  { name: "Corte fade", categoryName: "Cortes" },
  { name: "Corte de puntas mujer", categoryName: "Cortes" },
  { name: "Corte bob", categoryName: "Cortes" },
  { name: "Corte infantil", categoryName: "Cortes" },
  { name: "Corte con diseño", categoryName: "Cortes" },

  // Peinados
  { name: "Peinado recogido", categoryName: "Peinados" },
  { name: "Peinado con ondas", categoryName: "Peinados" },
  { name: "Trenzas africanas", categoryName: "Peinados" },
  { name: "Moños elegantes", categoryName: "Peinados" },
  { name: "Peinado semirecogido", categoryName: "Peinados" },
  { name: "Peinado con plancha", categoryName: "Peinados" },

  // Color cabello
  { name: "Tinte completo", categoryName: "Color cabello" },
  { name: "Mechas", categoryName: "Color cabello" },
  { name: "Balayage", categoryName: "Color cabello" },
  { name: "Reflejos", categoryName: "Color cabello" },
  { name: "Decoloración", categoryName: "Color cabello" },
  { name: "Baño de color", categoryName: "Color cabello" },

  // Uñas
  { name: "Manicure tradicional", categoryName: "Uñas" },
  { name: "Manicure semipermanente", categoryName: "Uñas" },
  { name: "Uñas acrílicas", categoryName: "Uñas" },
  { name: "Uñas en gel", categoryName: "Uñas" },
  { name: "Decoración de uñas", categoryName: "Uñas" },
  { name: "Pedicure spa", categoryName: "Uñas" },

  // Cejas
  { name: "Diseño de cejas", categoryName: "Cejas" },
  { name: "Perfilado con cera", categoryName: "Cejas" },
  { name: "Perfilado con hilo", categoryName: "Cejas" },
  { name: "Tinte de cejas", categoryName: "Cejas" },
  { name: "Henna en cejas", categoryName: "Cejas" },
  { name: "Laminado de cejas", categoryName: "Cejas" },

  // Alisados
  { name: "Alisado con keratina", categoryName: "Alisados" },
  { name: "Alisado japonés", categoryName: "Alisados" },
  { name: "Alisado progresivo", categoryName: "Alisados" },
  { name: "Alisado brasileño", categoryName: "Alisados" },
  { name: "Botox capilar", categoryName: "Alisados" },
  { name: "Tratamiento antiencrespamiento", categoryName: "Alisados" },

  // Maquillaje
  { name: "Maquillaje social", categoryName: "Maquillaje" },
  { name: "Maquillaje para novias", categoryName: "Maquillaje" },
  { name: "Maquillaje artístico", categoryName: "Maquillaje" },
  { name: "Maquillaje de día", categoryName: "Maquillaje" },
  { name: "Maquillaje de noche", categoryName: "Maquillaje" },
  { name: "Maquillaje para fotografía", categoryName: "Maquillaje" },

  // Pestañas
  { name: "Lifting de pestañas", categoryName: "Pestañas" },
  { name: "Extensiones clásicas", categoryName: "Pestañas" },
  { name: "Extensiones volumen ruso", categoryName: "Pestañas" },
  { name: "Retoque de extensiones", categoryName: "Pestañas" },
  { name: "Tinte de pestañas", categoryName: "Pestañas" },
  { name: "Laminado de pestañas", categoryName: "Pestañas" },

  // Extensiones de cabello
  { name: "Extensiones con keratina", categoryName: "Extensiones de cabello" },
  { name: "Extensiones de clip", categoryName: "Extensiones de cabello" },
  { name: "Extensiones de cortina", categoryName: "Extensiones de cabello" },
  { name: "Extensiones adhesivas", categoryName: "Extensiones de cabello" },
  {
    name: "Mantenimiento de extensiones",
    categoryName: "Extensiones de cabello",
  },
  { name: "Retiro de extensiones", categoryName: "Extensiones de cabello" },

  // Depilación facial
  { name: "Depilación con cera", categoryName: "Depilación facial" },
  { name: "Depilación con hilo", categoryName: "Depilación facial" },
  { name: "Depilación de bozo", categoryName: "Depilación facial" },
  { name: "Depilación de mentón", categoryName: "Depilación facial" },
  { name: "Depilación de patillas", categoryName: "Depilación facial" },
  { name: "Depilación completa facial", categoryName: "Depilación facial" },

  // Limpieza facial
  { name: "Limpieza facial profunda", categoryName: "Limpieza facial" },
  { name: "Limpieza facial con vapor", categoryName: "Limpieza facial" },
  { name: "Limpieza con exfoliación", categoryName: "Limpieza facial" },
  { name: "Limpieza para piel grasa", categoryName: "Limpieza facial" },
  { name: "Limpieza con extracción", categoryName: "Limpieza facial" },
  {
    name: "Limpieza con mascarilla hidratante",
    categoryName: "Limpieza facial",
  },
];

export const loadCategoryData = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    await Promise.all([
      Service.deleteMany({}),
      SubCategory.deleteMany({}),
      Category.deleteMany({}),
    ]);

    const categories = await Category.insertMany(categoriesData);

    for (const subCat of subCategoriesData) {
      const category = categories.find((c) => c.name === subCat.categoryName);
      if (category) {
        const newSubCat = await SubCategory.create({
          name: subCat.name,
          categoryId: category._id,
        });

        await Service.create({
          name: newSubCat.name,
          categoryId: category._id,
          subCategoryId: newSubCat._id,
          price: 20000,
          duration: 30,
          status: "active",
        });
      }
    }

    console.log(
      "Categorías, subcategorías y servicios cargados correctamente."
    );
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

loadCategoryData();

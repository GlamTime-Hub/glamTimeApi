import { Service } from "../components/service/model/service.model";

const servicesData = [
  {
    name: "Corte sencillo",
    description: "Corte de cabello estándar para hombre",
    status: "active",
    price: 15000,
    subCategoryId: "67e6ff32e035edd4d7bc6cf6",
    categoryId: "67e6ff32e035edd4d7bc6cf2",
    duration: 30,
  },
  {
    name: "Barba",
    description: "Corte de barba",
    status: "active",
    price: 12000,
    subCategoryId: "67e6ff32e035edd4d7bc6cfa",
    categoryId: "67e6ff32e035edd4d7bc6cf2",
    duration: 25,
  },
];

export const loadServiceData = async () => {
  try {
    await Service.deleteMany({});

    await Service.insertMany(servicesData);
  } catch (error) {
    console.error("error: ", error);
  }
};

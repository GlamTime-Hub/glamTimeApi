import { Professional } from "../components/professional/model/professional.model";

const professionalsData = [
  {
    name: "Adrian",
    userId: "67e6b721fdc28482c5ddfff0",
    businessId: "67f0b38af963251e54ef972f",
    status: "active",
    rating: 4.7,
    servicesId: ["67f0dc2926d81c3b9fd47e04", "67f0dc2926d81c3b9fd47e05"],
    workingHours: {
      monday: { start: 9, end: 18 },
      tuesday: { start: 9, end: 18 },
      wednesday: { start: 9, end: 18 },
      thursday: { start: 9, end: 18 },
      friday: { start: 9, end: 18 },
      saturday: { start: 10, end: 16 },
    },
    receivedComments: 24,
    likes: 56,
  },
];

export const loadProfessionalData = async () => {
  try {
    await Professional.deleteMany({});

    await Professional.insertMany(professionalsData);
  } catch (error) {
    console.error("Error: ", error);
  }
};

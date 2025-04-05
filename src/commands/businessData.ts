import { Business } from "../components/business/model/business.model";

const businessesData = [
  {
    name: "Glam",
    location: { type: "Point", coordinates: [-74.072092, 4.710989] },
    phoneNumber: "3108582340",
    country: "67e6ff31e035edd4d7bc6cf0",
    city: "67e6ff33e035edd4d7bc6d0a",
    receivedComments: 15,
    likes: 45,
    rating: 4.5,
    email: "glam@example.com",
    urlPhoto: "https://example.com/photos/glam.jpg",
    status: "active",
  },
  {
    name: "Oasis",
    location: { type: "Point", coordinates: [-99.133209, 19.432608] },
    phoneNumber: "3108582340",
    country: "67e6ff31e035edd4d7bc6cf0",
    city: "67e6ff31e035edd4d7bc6cf0",
    receivedComments: 28,
    likes: 72,
    rating: 4.8,
    email: "oasis@example.com",
    urlPhoto: "https://example.com/photos/oasis.jpg",
    status: "active",
  },
];

export const loadBusinessData = async () => {
  try {
    await Business.deleteMany({});

    await Business.insertMany(businessesData);
  } catch (error) {
    console.error("Error:", error);
  }
};

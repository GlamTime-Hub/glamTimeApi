import { Business } from "./../model/business.model";

const getBusiness = async (filters: any) => {
  return await Business.aggregate([
    { $match: filters },
    {
      $project: {
        _id: 1,
        name: 1,
        rating: 1,
        urlPhoto: 1,
        likes: 1,
      },
    },
  ]);
};

export { getBusiness };

import mongoose from "mongoose";
import { Category } from "../../util/model/category.model";
import { Service } from "../model/service.model";

const getServicesByBusinessId = async (
  businessId: string,
  filterByBusiness: boolean
) => {
  const pipeline: any[] = [
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "categoryId",
        as: "subCategories",
      },
    },
    { $unwind: "$subCategories" },
    {
      $sort: {
        "subCategories.name": 1, // Ordenar subcategorías por nombre
      },
    },
  ];

  const serviceLookup: any = {
    $lookup: {
      from: "services",
      let: {
        categoryId: "$_id",
        subCategoryId: "$subCategories._id",
        businessId: new mongoose.Types.ObjectId(businessId),
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$category", "$$categoryId"] },
                { $eq: ["$subCategory", "$$subCategoryId"] },
                { $eq: ["$business", "$$businessId"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            status: 1,
            price: 1,
            duration: 1,
            business: 1,
          },
        },
      ],
      as: "matchedService",
    },
  };

  if (filterByBusiness) {
    serviceLookup.$lookup.pipeline[0].$match.$expr.$and.push({
      $eq: ["$status", true],
    });
  }

  pipeline.push(serviceLookup);

  pipeline.push({
    $addFields: {
      "subCategories.service": {
        $cond: {
          if: { $gt: [{ $size: "$matchedService" }, 0] },
          then: { $arrayElemAt: ["$matchedService", 0] },
          else: { status: false, price: 0, duration: 0 },
        },
      },
    },
  });

  if (filterByBusiness) {
    pipeline.push({
      $match: {
        "subCategories.service.status": true,
      },
    });
  }

  pipeline.push({
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      subCategories: { $push: "$subCategories" },
    },
  });

  pipeline.push({
    $sort: {
      name: 1,
    },
  });

  return await Category.aggregate(pipeline);
};

const activeServiceByBusiness = async (activeService: any) => {
  if (!activeService.serviceId) {
    const service = {
      status: true,
      createdAt: new Date(),
      price: activeService.price,
      business: activeService.businessId,
      subCategory: new mongoose.Types.ObjectId(activeService.subcategoryId),
      category: new mongoose.Types.ObjectId(activeService.categoryId),
      duration: activeService.duration,
    };

    return await Service.create(service);
  }

  return await Service.findByIdAndUpdate(
    activeService.serviceId,
    {
      status: false,
      duration: activeService.duration,
      price: activeService.price,
    },
    { new: true }
  );
};

export { getServicesByBusinessId, activeServiceByBusiness };

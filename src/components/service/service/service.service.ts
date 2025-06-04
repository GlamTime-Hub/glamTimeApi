import mongoose from "mongoose";
import { Category } from "../../util/model/category.model";
import { Service } from "../model/service.model";

const getServicesByBusinessId = async (
  businessId: string,
  filterByBusiness: boolean,
  businessType: string
) => {
  const pipeline: any[] = [
    {
      $match: {
        businesstype: new mongoose.Types.ObjectId(businessType),
      },
    },
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
      status: activeService.status,
      duration: activeService.duration,
      price: activeService.price,
    },
    { new: true }
  );
};

const updateService = async (service: any) => {
  return await Service.findByIdAndUpdate(service.serviceId, {
    price: service.price,
    duration: service.duration,
  });
};

const getServicesByProfessional = async (
  professionalId: string,
  businessId: string
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
                  { $eq: ["$status", true] },
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
              category: 1,
              subCategory: 1,
            },
          },
        ],
        as: "matchedService",
      },
    },
    {
      $unwind: {
        path: "$matchedService",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "professionalservices",
        let: {
          serviceId: "$matchedService._id",
          professionalId: new mongoose.Types.ObjectId(professionalId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$professional", "$$professionalId"] },
                  { $eq: ["$service", "$$serviceId"] },
                ],
              },
            },
          },
        ],
        as: "professionalServiceMatch",
      },
    },
    {
      $addFields: {
        "subCategories.service": {
          $mergeObjects: [
            "$matchedService",
            {
              isAssignedToProfessional: {
                $gt: [{ $size: "$professionalServiceMatch" }, 0],
              },
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        subCategories: { $push: "$subCategories" },
      },
    },
    {
      $sort: {
        name: 1,
      },
    },
  ];
  return await Category.aggregate(pipeline);
};

export {
  getServicesByBusinessId,
  activeServiceByBusiness,
  updateService,
  getServicesByProfessional,
};

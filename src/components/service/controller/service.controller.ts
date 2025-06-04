import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  activeServiceByBusiness,
  getServicesByBusinessId,
  updateService,
  getServicesByProfessional,
} from "../service/service.service";
import { getProfessionalByUserId } from "../../professional/service/professional.service";

const getServicesByBusiness = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId, filterByBusiness, businessType } = req.body;

    const services = await getServicesByBusinessId(
      businessId,
      Boolean(filterByBusiness),
      businessType
    );

    res.status(201).json({
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

const activeService = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    await activeServiceByBusiness(body);

    res.status(201).json({
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateServiceById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    await updateService(body);

    res.status(201).json({
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

const getServicesByProfessionalAndService = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { businessId, professionalId, userAuthId } = req.body;

    if (!professionalId) {
      const professional = await getProfessionalByUserId(userAuthId);
      professionalId = professional?._id as string;
    }

    const services = await getServicesByProfessional(
      professionalId,
      businessId
    );

    res.status(201).json({
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getServicesByBusiness,
  activeService,
  updateServiceById,
  getServicesByProfessionalAndService,
};

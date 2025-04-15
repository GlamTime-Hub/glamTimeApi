import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  activeServiceByBusiness,
  getServicesByBusinessId,
  updateService,
} from "../service/service.service";

const getServicesByBusiness = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId, filterByBusiness } = req.body;

    const services = await getServicesByBusinessId(
      businessId,
      Boolean(filterByBusiness)
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

export { getServicesByBusiness, activeService, updateServiceById };

import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyTokens";
import {
  activeServiceByBusiness,
  getServicesByBusinessId,
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

export { getServicesByBusiness, activeService };

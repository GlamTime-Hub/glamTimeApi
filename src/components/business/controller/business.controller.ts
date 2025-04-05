import { NextFunction, Response, Request } from "express";
import {
  getBusiness,
  getBusinessById,
  getTopBusinessesByLocation,
} from "../service/business.service";

const getAllBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, latitude, longitude, page = 1, limit = 10 } = req.body;

    const business = await getBusiness(
      name,
      latitude,
      longitude,
      10,
      page,
      limit
    );
    res.status(201).json({
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

const getTopBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { latitude, longitude, page = 1, limit = 10 } = req.body;

    const business = await getTopBusinessesByLocation(
      latitude,
      longitude,
      10,
      page,
      limit
    );
    res.status(201).json({
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

const getBusinessDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const business = await getBusinessById(id);
    res.status(201).json({
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllBusiness, getTopBusiness, getBusinessDetail };

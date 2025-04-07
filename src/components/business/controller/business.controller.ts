import { NextFunction, Response, Request } from "express";
import {
  getBusiness,
  getBusinessById,
  getTopBusinessesByLocation,
  newBusiness,
} from "../service/business.service";
import { AuthenticatedRequest } from "../../../middleware/verifyTokens";

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
      data: business[0],
    });
  } catch (error) {
    next(error);
  }
};

const addNewBusiness = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const { id } = req.user;

    const businessData = {
      ...body,
      userAuthId: id,
    };

    const response = await newBusiness(businessData);
    res.status(201).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllBusiness, getTopBusiness, getBusinessDetail, addNewBusiness };

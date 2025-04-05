import { NextFunction, Request, Response } from "express";
import { getBusiness } from "../service/business.service";

const getBusinessByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, location } = req.query;

    const filters: any = {};

    if (name) filters.name = name;
    if (location) filters.location = location;

    const businesses = await getBusiness(filters);
    res.status(200).json({
      message: "Successful",
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

export { getBusinessByFilter };

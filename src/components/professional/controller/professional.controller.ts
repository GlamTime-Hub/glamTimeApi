import { NextFunction, Request, Response } from "express";
import {
  deactivateProfessional,
  getProfessional,
  getProfessionalsByBusinessId,
} from "../service/professional.service";

const getProfessionalByBusinessId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const professional = await getProfessional(businessId);
    res.status(200).json({
      status: true,
      data: professional,
    });
  } catch (error) {
    next(error);
  }
};

const getProfessionalsByBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const professionals = await getProfessionalsByBusinessId(businessId);

    res.status(200).json({
      status: true,
      data: professionals,
    });
  } catch (error) {
    next(error);
  }
};

const deactivateProfessionalsByBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId, id } = req.body;
    console.log("businessId", businessId);
    console.log("id", id);
    await deactivateProfessional(id, businessId);

    res.status(200).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProfessionalByBusinessId,
  getProfessionalsByBusiness,
  deactivateProfessionalsByBusiness,
};

import { NextFunction, Request, Response } from "express";
import {
  deactivateProfessional,
  getProfessionals,
  getProfessionalsByBusinessId,
  getProfessionalById,
  updateProfessionalsById,
} from "../service/professional.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";

const getProfessionalByBusinessId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const professional = await getProfessionals(businessId);
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

    console.log(professionals);

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
    await deactivateProfessional(id, businessId);

    res.status(200).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

const getProfessional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const professional = await getProfessionalById(id);
    res.status(200).json({
      status: true,
      data: professional[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateProfessional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professional } = req.body;

    await updateProfessionalsById(professional.user, professional);

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
  getProfessional,
  updateProfessional,
};

import { NextFunction, Request, Response } from "express";
import { getProfessional } from "../service/professional.service";

const getProfessionalByBusinessId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const professional = await getProfessional(businessId);
    res.status(200).json({
      message: "Successful",
      data: professional,
    });
  } catch (error) {
    next(error);
  }
};

export { getProfessionalByBusinessId };

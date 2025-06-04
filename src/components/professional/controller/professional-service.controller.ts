import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  addServiceToProfessional,
  removeServiceFromProfessional,
} from "../service/professional-service.service";
import { getProfessionalByUserId } from "../service/professional.service";

const addNewProfessionalService = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const body = req.body;

    const professional = await getProfessionalByUserId(id);

    const newService = {
      professional: professional?._id,
      business: body.business,
      service: body.service,
      status: body.status,
    };

    await addServiceToProfessional(newService);

    res.status(201).json({
      message: "Servicio añadido correctamente",
    });
  } catch (error) {
    next(error);
  }
};

const removeProfessionalService = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { service } = req.params;

    await removeServiceFromProfessional(service);

    res.status(201).json({
      message: "Servicio desactivado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export { addNewProfessionalService, removeProfessionalService };

import { NextFunction, Response, Request } from "express";
import {
  getBusiness,
  getBusinessById,
  getBusinessByUserAuthId,
  getTopBusinessesByLocation,
  newBusiness,
  updateBusinessImageProfile,
  updateBusiness,
  updateBusinessLocation,
  handleBusinessStatus,
  getHomeBusinessById,
  getBusinessByProfessionalId,
  likeBusiness,
} from "../service/business.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  getUserByPhoneNumber,
  getUserByUserAuthId,
} from "../../user/service/user.service";
import mongoose from "mongoose";
import {
  getBusinessByProfessional,
  getProfessionalByUserId,
  newProfessional,
} from "../../professional/service/professional.service";
import { IProfessional } from "../../professional/model/professional.model";
import { newNotification } from "../../notification/service/notification.service";

const getHomeBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      filter: { filter, location, page = 1, limit = 10 },
    } = req.body;

    const business = await getBusiness(
      filter,
      location.latitude,
      location.longitude,
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

    const professional = {
      businessId: new mongoose.Types.ObjectId(response._id as string),
      user: body.userId,
      userAuthId: id,
      isActive: true,
      invitationStatus: "invitation-accepted",
    };

    await newProfessional(professional as IProfessional);

    res.status(201).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getBusinessByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const response = await getBusinessByUserAuthId(id);
    res.status(201).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getBusinessHomeByProfessionalId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const professional = await getProfessionalByUserId(id);

    const response = await getBusinessByProfessionalId(
      professional?._id as string
    );

    res.status(201).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const updateBusinessImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, urlPhoto } = req.body;

    const business = await updateBusinessImageProfile(id, urlPhoto);

    if (!business) {
      res.status(404).json({ message: "Negocio no encontrado" });
      return;
    }

    res.status(201).json({
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

const updateBusinessById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, ...rest } = req.body;

    const business = {
      ...rest,
      _id: id,
    };

    const response = await updateBusiness(business);

    if (!response) {
      res.status(404).json({ message: "Negocio no encontrado" });
      return;
    }

    res.status(201).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const updateBusinessLocationById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const response = await updateBusinessLocation(id, body);
    if (!response) {
      res.status(404).json({ message: "Negocio no encontrado" });
      return;
    }

    res.status(201).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const sendInvitationToProfessional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const { phoneNumber, phoneNumberExtension } = req.body;
    const { id } = req.user;

    const userTo = await getUserByPhoneNumber(
      phoneNumber,
      phoneNumberExtension
    );

    if (!userTo) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const existProfessional = await getBusinessByProfessional(
      userTo?.userAuthId
    );

    if (existProfessional.length > 0) {
      res
        .status(404)
        .json({ message: "El profesional ya tiene un negocio asociado." });
      return;
    }

    const userFrom = await getUserByUserAuthId(id);

    const professional = {
      businessId: new mongoose.Types.ObjectId(businessId),
      user: userTo._id,
      userAuthId: userTo.userAuthId,
    };

    const professionalCreated = await newProfessional(
      professional as IProfessional
    );

    const notification = {
      title: "Nueva Invitación",
      body: `Has recibido una nueva invitación de ${userFrom?.name} para trabajar en su negocio.`,
      to: {
        user: userTo._id,
        userAuthId: userTo.userAuthId,
      },
      from: {
        userAuthId: id,
        user: userFrom?._id,
      },
      type: "invitation",
      meta: {
        business: businessId,
        professional: professionalCreated._id,
        booking: null,
      },
    };

    await newNotification(notification);

    res.status(201).json({
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

const handleBusinessStatusById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, isActive } = req.body;
    await handleBusinessStatus(id, isActive);

    res.status(201).json({
      data: true,
    });
  } catch (error) {
    next(error);
  }
};

const getHomeBusinessDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const business = await getHomeBusinessById(id);
    res.status(201).json({
      status: true,
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

const addLikeBusiness = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId, userId } = req.body;
    const { id } = req.user;

    const business = await likeBusiness(businessId, id, userId);
    res.status(201).json({
      status: true,
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getHomeBusiness,
  getTopBusiness,
  getBusinessDetail,
  addNewBusiness,
  getBusinessByUserId,
  updateBusinessImage,
  updateBusinessById,
  updateBusinessLocationById,
  handleBusinessStatusById,
  sendInvitationToProfessional,
  getHomeBusinessDetail,
  getBusinessHomeByProfessionalId,
  addLikeBusiness,
};

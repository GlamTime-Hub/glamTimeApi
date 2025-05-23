import { NextFunction, Request, Response } from "express";
import {
  deactivateProfessional,
  getProfessionals,
  getProfessionalsByBusinessId,
  getProfessionalById,
  updateProfessionalsById,
  handleInvitation,
  updateWorkingHourStatus,
  getProfessionalDetailById,
  getBusinessByProfessional,
} from "../service/professional.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  newNotification,
  markNotificationAsRead,
} from "../../notification/service/notification.service";
import { updateUserById } from "../../user/service/user.service";

const getProfessionalByBusinessId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const professionals = await getProfessionals(businessId);
    res.status(200).json({
      status: true,
      data: professionals,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProfessionalsByBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId, useIsActive } = req.params;

    const professionals = await getProfessionalsByBusinessId(
      businessId,
      Boolean(useIsActive)
    );

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
    const { businessId } = req.params;

    const professional = await getProfessionalById(id, businessId);

    res.status(200).json({
      status: true,
      data: professional.length === 0 ? null : professional[0],
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

const handleInvitationProfessional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { invitation } = req.body;

    //actualizamos el profesional con el estado de la invitacion
    await handleInvitation(
      invitation.toUser.user,
      invitation.businessId,
      invitation.invitationStatus
    );

    // marcamos la notificacion como leida
    await markNotificationAsRead(invitation.notificationId);

    if (invitation.invitationStatus === "invitation-accepted") {
      // cambiamos rol del user
      await updateUserById({
        userAuthId: invitation.toUser.userAuthId,
        role: "professional",
      });
    }

    //Notificamos al admin la respuesta del professional
    const notification = {
      business: invitation.businessId,
      message:
        invitation.invitationStatus === "invitation-accepted"
          ? `Ha aceptado trabajar contigo.`
          : `Ha rechazado la solicitud de unirte a tu equipo.`,
      to: {
        user: invitation.fromUser.user,
        userAuthId: invitation.fromUser.userAuthId,
      },
      from: {
        userAuthId: invitation.toUser.userAuthId,
        user: invitation.toUser.user,
      },
      type: invitation.invitationStatus,
    };

    await newNotification(notification);

    res.status(200).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

const handleWorkingHours = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professionalId, day, isActive } = req.body;
    await updateWorkingHourStatus(professionalId, day, isActive);
    res.status(200).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

const getProfessionalDetail = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, businessId } = req.params;
    const professional = await getProfessionalDetailById(id, businessId);
    res.status(200).json({
      status: true,
      data: professional[0],
    });
  } catch (error) {
    next(error);
  }
};

const getBusinessByProfessionalByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const professional = await getBusinessByProfessional(id);
    res.status(200).json({
      status: true,
      data: professional,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProfessionalByBusinessId,
  getAllProfessionalsByBusiness,
  deactivateProfessionalsByBusiness,
  getProfessional,
  updateProfessional,
  handleInvitationProfessional,
  handleWorkingHours,
  getProfessionalDetail,
  getBusinessByProfessionalByUserId,
};

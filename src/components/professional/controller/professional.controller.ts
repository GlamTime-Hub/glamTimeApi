import { NextFunction, Request, Response } from "express";
import {
  deactivateProfessional,
  getProfessionals,
  getProfessionalsByBusinessId,
  getProfessionalById,
  updateProfessionalsById,
  handleInvitation,
  getProfessionalDetailById,
  getBusinessByProfessional,
  getProfessionalByProfessionalId,
  getProfessionalsWithServices,
  likeProfessional,
  getProfessionalFavorites,
} from "../service/professional.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import {
  newNotification,
  markNotificationAsRead,
} from "../../notification/service/notification.service";
import { updateUserById } from "../../user/service/user.service";
import { getSingleBusiness } from "../../business/service/business.service";
import { deleteProfessionalServices } from "../service/professional-service.service";

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
      useIsActive === "true"
    );

    res.status(200).json({
      status: true,
      data: professionals,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProfessionalsWithActiveService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { businessId, serviceId } = req.params;

    const professionals = await getProfessionalsWithServices(
      businessId,
      serviceId
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
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userAuthId } = req.user;
    const { businessId, id, userId } = req.body;

    const professional = await deactivateProfessional(id, businessId);

    if (professional) {
      await updateUserById({
        userAuthId: professional.userAuthId,
        role: "user",
      });

      const business = await getSingleBusiness(businessId);

      await deleteProfessionalServices(professional._id.toString(), businessId);

      const notificationProfessional = {
        title: "Perfil Profesional Desactivado",
        body: `Tu perfil profesional en ${business?.name} ha sido desactivado.`,
        to: {
          user: professional.user,
          userAuthId: professional.userAuthId,
        },
        from: {
          userAuthId: userAuthId,
          user: userId,
        },
        type: "invitation-removed",
        meta: {
          business: businessId,
          professional: professional._id,
          booking: null,
        },
      };

      await newNotification(notificationProfessional);
    }

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
    const professional = await handleInvitation(
      invitation.toUser.user,
      invitation.businessId,
      invitation.invitationStatus
    );

    // marcamos la notificacion como leida
    await markNotificationAsRead(invitation.notificationId);

    const accepted = invitation.invitationStatus === "invitation-accepted";

    // cambiamos rol del user
    const user = await updateUserById({
      userAuthId: invitation.toUser.userAuthId,
      role: accepted ? "professional" : "user",
    });

    //Notificamos al admin la respuesta del professional
    const notification = {
      title: accepted ? "Invitación aceptada" : "Invitación rechazada",
      body: accepted
        ? `${user?.name} Ha aceptado ser parte de tu equipo de trabajo.`
        : `${user?.name} Ha rechazado la solicitud de unirte a tu equipo.`,
      to: {
        user: invitation.fromUser.user,
        userAuthId: invitation.fromUser.userAuthId,
      },
      from: {
        userAuthId: invitation.toUser.userAuthId,
        user: invitation.toUser.user,
      },
      type: invitation.invitationStatus,
      meta: {
        business: invitation.businessId,
        booking: null,
        professional: professional?._id,
      },
    };

    await newNotification(notification);

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

const getBusinessByProfessionalByProfessionalId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professionalId } = req.params;
    const professional = await getProfessionalByProfessionalId(professionalId);
    res.status(200).json({
      status: true,
      data: professional[0],
    });
  } catch (error) {
    next(error);
  }
};

const addLikeProfessional = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professionalId, userId } = req.body;
    const { id } = req.user;
    await likeProfessional(professionalId, id, userId);
    res.status(201).json({
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

const getProfessionalFavoritesByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const professionales = await getProfessionalFavorites(id);

    res.status(201).json({
      status: true,
      data: professionales,
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
  getProfessionalDetail,
  getBusinessByProfessionalByUserId,
  getBusinessByProfessionalByProfessionalId,
  getAllProfessionalsWithActiveService,
  addLikeProfessional,
  getProfessionalFavoritesByUser,
};

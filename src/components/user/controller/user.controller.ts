import { NextFunction, Request, Response } from "express";
import {
  createUser,
  getUserById,
  updateUserById,
  updateUserImageProfile,
  updateNotificationPreference,
  getUserAllReviews,
  getUserByPhoneNumber,
} from "../service/user.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";

const newUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    const newUser = {
      ...body,
      userAuthId: body.userAuthId,
      email: body.email,
    };

    const user = await createUser(newUser);

    res.status(201).json({
      message: "Usuario creado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfileById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const user = await updateUserById(body);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { urlPhoto } = req.body;
    const { id } = req.user;

    const user = await updateUserImageProfile(id, urlPhoto);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateNotificationUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationPreference } = req.body;
    const { id } = req.user;

    const user = await updateNotificationPreference(id, notificationPreference);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const allUserReviews = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const reviews = await getUserAllReviews(id);

    res.status(200).json({
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const getUserByPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber, phoneNumberExtension } = req.params;
    const user = await getUserByPhoneNumber(phoneNumber, phoneNumberExtension);
    res.status(201).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export {
  newUser,
  getUserProfileById,
  updateUser,
  updateUserImage,
  updateNotificationUser,
  allUserReviews,
  getUserByPhone,
};

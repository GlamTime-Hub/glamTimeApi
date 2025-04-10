import { NextFunction, Request, Response } from "express";
import {
  createUser,
  existsUser,
  getUserById,
  updateUserById,
  updateUserImageProfile,
  updateNotificationPreference,
  getUserAllReviews,
} from "../service/user.service";
import { AuthenticatedRequest } from "../../../middleware/verifyTokens";
import { supabase } from "../../../config/supabase";

const newUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, redirectTo, ...profile } = req.body;

    const userExist = await existsUser(email);

    if (userExist) {
      res.status(409).json({
        message: `Ya existe un usuario con el email: ${email}`,
        data: userExist,
      });
      return;
    }

    const supabaseUser = await supabase.auth.signUp({
      email,
      password,
      phone: `${profile.phoneNumberExtension}${profile.phoneNumber}`,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          role: profile.role,
        },
      },
    });

    const newUser = {
      userAuthId: supabaseUser.data.user?.id,
      ...profile,
      email,
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

    console.log("body", body);

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

export {
  newUser,
  getUserProfileById,
  updateUser,
  updateUserImage,
  updateNotificationUser,
  allUserReviews,
};

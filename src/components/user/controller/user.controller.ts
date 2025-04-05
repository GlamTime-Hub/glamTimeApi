import { NextFunction, Request, Response } from "express";
import { createUser, getUserById } from "../service/user.service";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";

const newUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { exists, user } = await createUser(req.body);

    if (exists) {
      res.status(409).json({
        message: `Ya existe un usuario con el email: ${user.email}`,
        data: user,
      });
      return;
    }

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
    const { userAuthId } = req.user;

    const user = await getUserById(userAuthId);

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

export { newUser, getUserProfileById };

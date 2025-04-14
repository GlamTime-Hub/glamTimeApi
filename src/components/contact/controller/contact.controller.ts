import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyToken";
import { createContact } from "../service/contact.service";

const newContact = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const newContact = {
      userAuthId: id,
      ...req.body,
    };

    await createContact(newContact);

    res.status(201).json({
      message: "Contact creado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export { newContact };

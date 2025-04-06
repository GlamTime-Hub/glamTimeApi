import { NextFunction, Request, Response } from "express";
import { supabase } from "../config/supabase";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Token no proporcionado o formato incorrecto" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token is required" });
    return;
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.log("errror", error);
      res.status(401).json({ message: "Invalid token", error });
      return;
    }

    req.user = data.user;

    next();
    return;
  } catch (err) {
    console.error("Error validating token:", err);
    next(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

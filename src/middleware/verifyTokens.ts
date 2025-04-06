import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

// Configura el cliente JWKS para obtener las claves públicas de Supabase
const client = jwksClient({
  jwksUri: `${process.env.SUPABSE_API_URL}/auth/v1/certs`,
  requestHeaders: {
    apikey: process.env.SUPABSE_PUBLIC_API_KEY || "",
  },
});

// Middleware de autenticación
export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Token no proporcionado o formato incorrecto" });
    return;
  }

  const token = authHeader.split(" ")[1];

  console.log("token", token);

  try {
    // Obtener la clave pública para verificar el token
    const getKey = (header: any, callback: any) => {
      client.getSigningKey(header.kid, (_, key) => {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
      });
    };

    // Verificar el token
    jwt.verify(
      token,
      getKey,
      {
        audience: "authenticated",
        issuer: `${process.env.SUPABSE_API_URL}/auth/v1`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        console.log("error", err);
        if (err) {
          res
            .status(401)
            .json({ error: "Token inválido", details: err.message });
          return;
        }

        console.log("decoded", decoded);
        req.user = decoded;

        next();
        return;
      }
    );

    return;
  } catch (error) {
    next(error);
    res.status(500).json({ error: "Error al verificar el token" });
  }
};

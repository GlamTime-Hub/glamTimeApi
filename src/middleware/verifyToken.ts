import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

// Configura el cliente JWKS para obtener las claves públicas de Supabase
const client = jwksClient({
  jwksUri: `${process.env.SUPABSE_API_URL}/auth/v1/certs`
});

// Middleware de autenticación
export const supabaseAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o formato incorrecto' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Obtener la clave pública para verificar el token
    const getKey = (header: any, callback: any) => {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
      });
    };

    // Verificar el token
    jwt.verify(token, getKey, {
      audience: 'authenticated',
      issuer: `${process.env.SUPABSE_API_URL}/auth/v1`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido', details: err.message });
      }
      
      // Añadir el usuario decodificado a la solicitud
      (req as any).user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar el token' });
  }
};
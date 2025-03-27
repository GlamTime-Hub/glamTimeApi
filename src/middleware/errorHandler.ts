import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[${req.method}] ${req.url} - Error:`, err);
  console.error(`[${req.method}] ${req.url} - Error:`, next);

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      datails: err.details || null,
    },
  });
};

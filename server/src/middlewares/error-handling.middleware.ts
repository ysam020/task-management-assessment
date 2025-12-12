import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { config } from "../config";

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Log unexpected errors in development
  if (config.nodeEnv === "development") {
    console.error("Unexpected Error:", err);
  }

  // Generic error response
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

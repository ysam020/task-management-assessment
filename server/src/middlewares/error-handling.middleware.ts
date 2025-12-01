import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err instanceof Error &&
        (err as any).errors && { errors: (err as any).errors }),
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[]) || [];
      return res.status(409).json({
        status: "error",
        message: `A record with this ${target.join(", ")} already exists`,
      });
    }

    // Record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found",
      });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data provided",
    });
  }

  // Log unexpected errors
  console.error("Unexpected error:", err);

  // Handle unexpected errors
  return res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
};

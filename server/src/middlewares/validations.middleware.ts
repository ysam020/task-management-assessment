import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const errorMessage = error.errors
        ?.map((err: any) => err.message)
        .join(", ");
      next(new ValidationError(errorMessage || "Validation failed"));
    }
  };
};

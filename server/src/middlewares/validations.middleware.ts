import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(new ValidationError("Validation failed", formattedErrors));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated as any;
      next();
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        next(new ValidationError("Validation failed", formattedErrors));
      } else {
        next(error);
      }
    }
  };
};

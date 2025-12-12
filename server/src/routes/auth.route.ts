import { Router } from "express";
import authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validations.middleware";
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
} from "../utils/validations";

const router = Router();

// Public routes
router.post("/register", validate(RegisterSchema), authController.register);
router.post("/login", validate(LoginSchema), authController.login);
router.post("/refresh", validate(RefreshTokenSchema), authController.refresh);
router.post("/logout", validate(RefreshTokenSchema), authController.logout);

export default router;

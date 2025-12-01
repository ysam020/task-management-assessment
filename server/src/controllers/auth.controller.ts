import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from "../utils/validations";
import { AuthRequest } from "../middlewares/authentication.middleware";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;
      const result = await authService.refresh(refreshToken);

      res.status(200).json({
        status: "success",
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;
      await authService.logout(refreshToken);

      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await authService.getCurrentUser(userId);

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();

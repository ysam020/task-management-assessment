import jwt from "jsonwebtoken";
import { config } from "../config/index";
import { UnauthorizedError } from "./errors";

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry,
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiry,
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const getTokenExpiryDate = (expiresIn: string): Date => {
  const now = new Date();
  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error("Invalid expiry format");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return new Date(now.getTime() + value * 1000);
    case "m":
      return new Date(now.getTime() + value * 60 * 1000);
    case "h":
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case "d":
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      throw new Error("Invalid time unit");
  }
};

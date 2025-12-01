import jwt from "jsonwebtoken";
import { config } from "../config/index";
import { UnauthorizedError } from "./errors";

export interface TokenPayload {
  userId: number;
  email: string;
}

export interface AccessTokenPayload extends TokenPayload {
  type: "access";
}

export interface RefreshTokenPayload extends TokenPayload {
  type: "refresh";
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    { ...payload, type: "access" } as AccessTokenPayload,
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiry }
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    { ...payload, type: "refresh" } as RefreshTokenPayload,
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.accessSecret
    ) as AccessTokenPayload;

    if (decoded.type !== "access") {
      throw new UnauthorizedError("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Access token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid access token");
    }
    throw error;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.refreshSecret
    ) as RefreshTokenPayload;

    if (decoded.type !== "refresh") {
      throw new UnauthorizedError("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Refresh token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    throw error;
  }
};

export const getTokenExpiryDate = (expiryString: string): Date => {
  const now = new Date();
  const match = expiryString.match(/^(\d+)([smhd])$/);

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
      throw new Error("Invalid expiry unit");
  }
};

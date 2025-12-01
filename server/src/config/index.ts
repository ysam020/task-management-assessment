import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

type JwtExpiry = Extract<SignOptions["expiresIn"], string>;

dotenv.config();

// Configuration
interface Config {
  port: number;
  nodeEnv: string;
  database: {
    url: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiry: JwtExpiry;
    refreshExpiry: JwtExpiry;
  };
  cors: {
    origin: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    url: process.env.DATABASE_URL || "",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    accessExpiry: (process.env.JWT_ACCESS_EXPIRY || "15m") as JwtExpiry,
    refreshExpiry: (process.env.JWT_REFRESH_EXPIRY || "7d") as JwtExpiry,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};

// Validate required environment variables
const validateConfig = () => {
  const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

validateConfig();

// Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      config.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (config.nodeEnv !== "production") globalThis.prisma = prisma;

export { config, prisma };

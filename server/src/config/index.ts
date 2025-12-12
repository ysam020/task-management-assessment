import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  upload: {
    dir: process.env.UPLOAD_DIR || "./uploads",
    maxSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};

export const prisma = new PrismaClient();

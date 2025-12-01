import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/index";
import routes from "./routes";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error-handling.middleware";

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api", routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;

import { Router } from "express";
import authRoutes from "./auth.route";
import taskRoutes from "./task.route";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

export default router;

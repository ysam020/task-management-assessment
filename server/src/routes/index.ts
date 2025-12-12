import { Router } from "express";
import authRoutes from "./auth.route";
import candidateRoutes from "./candidate.route";
import feedbackRoutes from "./feedback.route";
import noteRoutes from "./note.route";
import aiSearchRoutes from "./ai-search.route";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/candidates", candidateRoutes);
router.use("/feedbacks", feedbackRoutes);
router.use("/notes", noteRoutes);
router.use("/ai-search", aiSearchRoutes);

export default router;

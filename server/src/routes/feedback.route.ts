import { Router } from "express";
import feedbackController from "../controllers/feedback.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { validate } from "../middlewares/validations.middleware";
import { CreateFeedbackSchema } from "../utils/validations";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create feedback for a candidate - both HR and Interviewer can add feedback
router.post(
  "/:candidateId/feedbacks",
  validate(CreateFeedbackSchema),
  feedbackController.createFeedback
);

// Get all feedbacks for a candidate - both roles can view
router.get("/:candidateId/feedbacks", feedbackController.getCandidateFeedbacks);

// Get specific feedback - both roles can view
router.get("/:id", feedbackController.getFeedbackById);

// Delete feedback - creator or HR only (handled in service)
router.delete("/:id", feedbackController.deleteFeedback);

export default router;

import { Response, NextFunction } from "express";
import feedbackService from "../services/feedback.service";
import { AuthRequest } from "../middlewares/authentication.middleware";
import { CreateFeedbackInput } from "../utils/validations";

export class FeedbackController {
  async createFeedback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const candidateId = parseInt(req.params.candidateId, 10);
      const userId = req.user!.userId;
      const data: CreateFeedbackInput = req.body;

      const feedback = await feedbackService.createFeedback(
        candidateId,
        userId,
        data
      );

      res.status(201).json({
        status: "success",
        message: "Feedback added successfully",
        data: { feedback },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCandidateFeedbacks(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const candidateId = parseInt(req.params.candidateId, 10);
      const feedbacks = await feedbackService.getCandidateFeedbacks(
        candidateId
      );

      res.status(200).json({
        status: "success",
        data: { feedbacks },
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeedbackById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const feedback = await feedbackService.getFeedbackById(id);

      res.status(200).json({
        status: "success",
        data: { feedback },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFeedback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      await feedbackService.deleteFeedback(id, userId, userRole);

      res.status(200).json({
        status: "success",
        message: "Feedback deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FeedbackController();

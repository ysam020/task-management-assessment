import { Response, NextFunction } from "express";
import candidateService from "../services/candidate.service";
import { AuthRequest } from "../middlewares/authentication.middleware";
import {
  CreateCandidateInput,
  UpdateCandidateInput,
  MoveCandidateStageInput,
} from "../utils/validations";
import { CandidateStage } from "@prisma/client";

export class CandidateController {
  async createCandidate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: CreateCandidateInput = req.body;
      const candidate = await candidateService.createCandidate(data);

      res.status(201).json({
        status: "success",
        message: "Candidate created successfully",
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCandidates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { stage, search, page, limit } = req.query;

      const filters = {
        stage: stage as CandidateStage | undefined,
        search: search as string | undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      };

      const result = await candidateService.getCandidates(filters);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCandidateById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const candidate = await candidateService.getCandidateById(id);

      res.status(200).json({
        status: "success",
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCandidate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const data: UpdateCandidateInput = req.body;
      const candidate = await candidateService.updateCandidate(id, data);

      res.status(200).json({
        status: "success",
        message: "Candidate updated successfully",
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCandidate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await candidateService.deleteCandidate(id);

      res.status(200).json({
        status: "success",
        message: "Candidate deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);

      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No file uploaded",
        });
      }

      const resumeUrl = `/uploads/${req.file.filename}`;
      const candidate = await candidateService.uploadResume(id, resumeUrl);

      res.status(200).json({
        status: "success",
        message: "Resume uploaded successfully",
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  async moveToNextStage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const data: MoveCandidateStageInput = req.body;
      const candidate = await candidateService.moveToNextStage(id, data);

      res.status(200).json({
        status: "success",
        message: "Candidate moved to next stage successfully",
        data: { candidate },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await candidateService.getDashboardStats();

      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CandidateController();

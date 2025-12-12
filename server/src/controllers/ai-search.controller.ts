import { Response, NextFunction } from "express";
import aiSearchService from "../services/ai-search.service";
import { AuthRequest } from "../middlewares/authentication.middleware";
import { AISearchInput } from "../utils/validations";

export class AISearchController {
  async search(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: AISearchInput = req.body;
      const result = await aiSearchService.searchCandidates(data.query);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AISearchController();

import { Router } from "express";
import aiSearchController from "../controllers/ai-search.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { validate } from "../middlewares/validations.middleware";
import { AISearchSchema } from "../utils/validations";

const router = Router();

// All routes require authentication
router.use(authenticate);

// AI-powered search - both HR and Interviewer can use
router.post("/", validate(AISearchSchema), aiSearchController.search);

export default router;

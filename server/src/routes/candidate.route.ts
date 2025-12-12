import { Router } from "express";
import candidateController from "../controllers/candidate.controller";
import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middleware";
import { validate } from "../middlewares/validations.middleware";
import {
  CreateCandidateSchema,
  UpdateCandidateSchema,
  MoveCandidateStageSchema,
} from "../utils/validations";
import { upload } from "../config/multer";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard - accessible by both HR and Interviewer
router.get("/dashboard", candidateController.getDashboard);

// Get all candidates - accessible by both roles
router.get("/", candidateController.getCandidates);

// Get candidate by ID - accessible by both roles
router.get("/:id", candidateController.getCandidateById);

// Create candidate - HR only
router.post(
  "/",
  authorize("HR"),
  validate(CreateCandidateSchema),
  candidateController.createCandidate
);

// Update candidate - HR only
router.patch(
  "/:id",
  authorize("HR"),
  validate(UpdateCandidateSchema),
  candidateController.updateCandidate
);

// Delete candidate - HR only
router.delete("/:id", authorize("HR"), candidateController.deleteCandidate);

// Upload resume - HR only
router.post(
  "/:id/resume",
  authorize("HR"),
  upload.single("resume"),
  candidateController.uploadResume
);

// Move candidate to next stage - HR only
router.post(
  "/:id/move-stage",
  authorize("HR"),
  validate(MoveCandidateStageSchema),
  candidateController.moveToNextStage
);

export default router;

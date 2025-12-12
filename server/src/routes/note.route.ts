import { Router } from "express";
import noteController from "../controllers/note.controller";
import { authenticate } from "../middlewares/authentication.middleware";
import { validate } from "../middlewares/validations.middleware";
import { CreateNoteSchema, UpdateNoteSchema } from "../utils/validations";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create note for a candidate - both HR and Interviewer can add notes
router.post(
  "/candidates/:candidateId/notes",
  validate(CreateNoteSchema),
  noteController.createNote
);

// Get all notes for a candidate - both roles can view
router.get("/candidates/:candidateId/notes", noteController.getCandidateNotes);

// Get specific note - both roles can view
router.get("/:id", noteController.getNoteById);

// Update note - creator or HR only (handled in service)
router.patch("/:id", validate(UpdateNoteSchema), noteController.updateNote);

// Delete note - creator or HR only (handled in service)
router.delete("/:id", noteController.deleteNote);

export default router;

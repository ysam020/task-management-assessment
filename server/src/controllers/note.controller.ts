import { Response, NextFunction } from "express";
import noteService from "../services/note.service";
import { AuthRequest } from "../middlewares/authentication.middleware";
import { CreateNoteInput, UpdateNoteInput } from "../utils/validations";

export class NoteController {
  async createNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const candidateId = parseInt(req.params.candidateId, 10);
      const userId = req.user!.userId;
      const data: CreateNoteInput = req.body;

      const note = await noteService.createNote(candidateId, userId, data);

      res.status(201).json({
        status: "success",
        message: "Note created successfully",
        data: { note },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCandidateNotes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const candidateId = parseInt(req.params.candidateId, 10);
      const notes = await noteService.getCandidateNotes(candidateId);

      res.status(200).json({
        status: "success",
        data: { notes },
      });
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const note = await noteService.getNoteById(id);

      res.status(200).json({
        status: "success",
        data: { note },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const data: UpdateNoteInput = req.body;

      const note = await noteService.updateNote(id, userId, userRole, data);

      res.status(200).json({
        status: "success",
        message: "Note updated successfully",
        data: { note },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      await noteService.deleteNote(id, userId, userRole);

      res.status(200).json({
        status: "success",
        message: "Note deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NoteController();

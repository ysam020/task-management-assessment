import { prisma } from "../config";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import { CreateNoteInput, UpdateNoteInput } from "../utils/validations";

export class NoteService {
  async createNote(candidateId: number, userId: number, data: CreateNoteInput) {
    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const note = await prisma.note.create({
      data: {
        candidateId,
        userId,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return note;
  }

  async getCandidateNotes(candidateId: number) {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const notes = await prisma.note.findMany({
      where: { candidateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return notes;
  }

  async getNoteById(id: number) {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    return note;
  }

  async updateNote(
    id: number,
    userId: number,
    userRole: string,
    data: UpdateNoteInput
  ) {
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    // Only allow update by the note creator or HR
    if (note.userId !== userId && userRole !== "HR") {
      throw new ForbiddenError("You can only update your own notes");
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedNote;
  }

  async deleteNote(id: number, userId: number, userRole: string) {
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundError("Note not found");
    }

    // Only allow deletion by the note creator or HR
    if (note.userId !== userId && userRole !== "HR") {
      throw new ForbiddenError("You can only delete your own notes");
    }

    await prisma.note.delete({
      where: { id },
    });
  }
}

export default new NoteService();

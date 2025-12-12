import { prisma } from "../config";
import { NotFoundError } from "../utils/errors";
import { CreateFeedbackInput } from "../utils/validations";

export class FeedbackService {
  async createFeedback(
    candidateId: number,
    userId: number,
    data: CreateFeedbackInput
  ) {
    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const feedback = await prisma.feedback.create({
      data: {
        candidateId,
        userId,
        stage: candidate.stage,
        comment: data.comment,
        rating: data.rating,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            stage: true,
          },
        },
      },
    });

    return feedback;
  }

  async getCandidateFeedbacks(candidateId: number) {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { candidateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return feedbacks;
  }

  async getFeedbackById(id: number) {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            stage: true,
          },
        },
      },
    });

    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    return feedback;
  }

  async deleteFeedback(id: number, userId: number, userRole: string) {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    // Only allow deletion by the feedback creator or HR
    if (feedback.userId !== userId && userRole !== "HR") {
      throw new NotFoundError("You can only delete your own feedback");
    }

    await prisma.feedback.delete({
      where: { id },
    });
  }
}

export default new FeedbackService();

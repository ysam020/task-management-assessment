import { prisma } from "../config";
import { NotFoundError, BadRequestError } from "../utils/errors";
import {
  CreateCandidateInput,
  UpdateCandidateInput,
  MoveCandidateStageInput,
} from "../utils/validations";
import { CandidateStage } from "@prisma/client";

export class CandidateService {
  async createCandidate(data: CreateCandidateInput) {
    const candidate = await prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        skills: data.skills,
      },
      include: {
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        notes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        stageHistory: true,
      },
    });

    // Create initial stage history
    await prisma.stageHistory.create({
      data: {
        candidateId: candidate.id,
        toStage: "SCREENING",
        reason: "Initial stage",
      },
    });

    return candidate;
  }

  async getCandidates(filters?: {
    stage?: CandidateStage;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { position: { contains: filters.search, mode: "insensitive" } },
        { skills: { has: filters.search } },
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          feedbacks: {
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
            take: 5,
          },
          notes: {
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
            take: 5,
          },
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    // Check if candidates are stuck (> 2 days in same stage)
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const candidatesWithStuckFlag = candidates.map((candidate) => ({
      ...candidate,
      isStuck: candidate.stageEntered < twoDaysAgo,
    }));

    return {
      candidates: candidatesWithStuckFlag,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCandidateById(id: number) {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        feedbacks: {
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
        },
        notes: {
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
        },
        stageHistory: {
          orderBy: { movedAt: "desc" },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    // Check if candidate is stuck
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const isStuck = candidate.stageEntered < twoDaysAgo;

    return {
      ...candidate,
      isStuck,
    };
  }

  async updateCandidate(id: number, data: UpdateCandidateInput) {
    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!existingCandidate) {
      throw new NotFoundError("Candidate not found");
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        skills: data.skills,
      },
      include: {
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        notes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return candidate;
  }

  async deleteCandidate(id: number) {
    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!existingCandidate) {
      throw new NotFoundError("Candidate not found");
    }

    await prisma.candidate.delete({
      where: { id },
    });
  }

  async uploadResume(id: number, resumeUrl: string) {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    return prisma.candidate.update({
      where: { id },
      data: { resumeUrl },
      select: {
        id: true,
        name: true,
        email: true,
        resumeUrl: true,
      },
    });
  }

  async moveToNextStage(id: number, data: MoveCandidateStageInput) {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    // Validate stage progression
    const stageOrder: CandidateStage[] = [
      "SCREENING",
      "L1",
      "L2",
      "DIRECTOR",
      "HR",
      "COMPENSATION",
      "BG_CHECK",
      "OFFER",
    ];

    const currentIndex = stageOrder.indexOf(candidate.stage);
    const nextIndex = stageOrder.indexOf(data.toStage);

    if (nextIndex < currentIndex) {
      throw new BadRequestError("Cannot move to a previous stage");
    }

    // Update candidate stage
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        stage: data.toStage,
        stageEntered: new Date(),
      },
      include: {
        feedbacks: true,
        notes: true,
        stageHistory: true,
      },
    });

    // Create stage history record
    await prisma.stageHistory.create({
      data: {
        candidateId: id,
        fromStage: candidate.stage,
        toStage: data.toStage,
        reason: data.reason,
      },
    });

    return updatedCandidate;
  }

  async getDashboardStats() {
    const [
      totalCandidates,
      candidatesByStage,
      recentlyUpdated,
      stuckCandidates,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.candidate.groupBy({
        by: ["stage"],
        _count: true,
      }),
      prisma.candidate.findMany({
        take: 10,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          stage: true,
          updatedAt: true,
        },
      }),
      prisma.candidate.findMany({
        where: {
          stageEntered: {
            lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          stage: true,
          stageEntered: true,
        },
      }),
    ]);

    const stageStats = candidatesByStage.reduce((acc, item) => {
      acc[item.stage] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCandidates,
      candidatesByStage: stageStats,
      recentlyUpdated,
      stuckCandidates: stuckCandidates.length,
      stuckCandidatesList: stuckCandidates,
    };
  }
}

export default new CandidateService();

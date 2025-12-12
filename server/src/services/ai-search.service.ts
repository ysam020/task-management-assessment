import OpenAI from "openai";
import { config, prisma } from "../config";
import { BadRequestError } from "../utils/errors";
import { CandidateStage } from "@prisma/client";

export class AISearchService {
  private openai: OpenAI | null = null;

  constructor() {
    if (config.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
  }

  async searchCandidates(query: string) {
    if (!this.openai) {
      // Fallback to simple search if OpenAI is not configured
      return this.fallbackSearch(query);
    }

    try {
      // Use OpenAI to parse the natural language query
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a hiring assistant. Parse the user's natural language query and extract structured search parameters.
            
Available stages: SCREENING, L1, L2, DIRECTOR, HR, COMPENSATION, BG_CHECK, OFFER

Return a JSON object with these optional fields:
- stage: string (one of the available stages)
- skills: string[] (array of skills to search for)
- position: string (job position)
- search: string (general search term for name, email, or other fields)

Examples:
"Show candidates pending L2" -> {"stage": "L2"}
"Find frontend candidates with React experience" -> {"skills": ["React", "frontend"], "position": "frontend"}
"Show all candidates in screening" -> {"stage": "SCREENING"}
"Find candidates with Python and Django" -> {"skills": ["Python", "Django"]}`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.3,
      });

      const responseText = completion.choices[0]?.message?.content || "{}";
      const parsedQuery = JSON.parse(responseText);

      // Build Prisma query based on parsed parameters
      const where: any = {};

      if (parsedQuery.stage) {
        where.stage = parsedQuery.stage as CandidateStage;
      }

      if (parsedQuery.skills && parsedQuery.skills.length > 0) {
        where.skills = {
          hasSome: parsedQuery.skills,
        };
      }

      if (parsedQuery.position) {
        where.position = {
          contains: parsedQuery.position,
          mode: "insensitive",
        };
      }

      if (parsedQuery.search) {
        where.OR = [
          { name: { contains: parsedQuery.search, mode: "insensitive" } },
          { email: { contains: parsedQuery.search, mode: "insensitive" } },
          { position: { contains: parsedQuery.search, mode: "insensitive" } },
        ];
      }

      const candidates = await prisma.candidate.findMany({
        where,
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
            take: 3,
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
            take: 3,
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return {
        query: parsedQuery,
        results: candidates,
        count: candidates.length,
      };
    } catch (error) {
      console.error("AI Search Error:", error);
      // Fallback to simple search on error
      return this.fallbackSearch(query);
    }
  }

  private async fallbackSearch(query: string) {
    // Simple keyword-based search as fallback
    const lowercaseQuery = query.toLowerCase();

    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { position: { contains: query, mode: "insensitive" } },
      ],
    };

    // Check for stage keywords
    const stageKeywords: Record<string, CandidateStage> = {
      screening: "SCREENING",
      l1: "L1",
      "level 1": "L1",
      l2: "L2",
      "level 2": "L2",
      director: "DIRECTOR",
      hr: "HR",
      compensation: "COMPENSATION",
      "bg check": "BG_CHECK",
      background: "BG_CHECK",
      offer: "OFFER",
    };

    for (const [keyword, stage] of Object.entries(stageKeywords)) {
      if (lowercaseQuery.includes(keyword)) {
        where.stage = stage;
        break;
      }
    }

    const candidates = await prisma.candidate.findMany({
      where,
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
          take: 3,
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
          take: 3,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return {
      query: { search: query },
      results: candidates,
      count: candidates.length,
      fallback: true,
    };
  }
}

export default new AISearchService();

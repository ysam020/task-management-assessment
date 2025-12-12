import { z } from "zod";

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["HR", "INTERVIEWER"]).optional().default("INTERVIEWER"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Candidate validation schemas
export const createCandidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  experience: z.number().int().min(0).optional(),
  skills: z.array(z.string()).default([]),
});

export const updateCandidateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  position: z.string().min(1).optional(),
  experience: z.number().int().min(0).optional().nullable(),
  skills: z.array(z.string()).optional(),
});

export const moveCandidateStageSchema = z.object({
  toStage: z.enum([
    "SCREENING",
    "L1",
    "L2",
    "DIRECTOR",
    "HR",
    "COMPENSATION",
    "BG_CHECK",
    "OFFER",
  ]),
  reason: z.string().optional(),
});

export const candidateQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
  stage: z
    .enum([
      "SCREENING",
      "L1",
      "L2",
      "DIRECTOR",
      "HR",
      "COMPENSATION",
      "BG_CHECK",
      "OFFER",
    ])
    .optional(),
  search: z.string().optional(),
});

// Feedback validation schemas
export const createFeedbackSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().int().min(1).max(5).optional(),
});

// Note validation schemas
export const createNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export const updateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

// AI Search validation
export const aiSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type MoveCandidateStageInput = z.infer<typeof moveCandidateStageSchema>;
export type CandidateQueryInput = z.infer<typeof candidateQuerySchema>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type AISearchInput = z.infer<typeof aiSearchSchema>;

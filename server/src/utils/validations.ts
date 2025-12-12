import { z } from "zod";

// Auth validations
export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["HR", "INTERVIEWER"]).optional().default("INTERVIEWER"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Candidate validations
export const CreateCandidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  experience: z.number().int().min(0).optional(),
  skills: z.array(z.string()).default([]),
});

export const UpdateCandidateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  position: z.string().min(1).optional(),
  experience: z.number().int().min(0).optional(),
  skills: z.array(z.string()).optional(),
});

export const MoveCandidateStageSchema = z.object({
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

// Feedback validations
export const CreateFeedbackSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().int().min(1).max(5).optional(),
});

// Note validations
export const CreateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

// AI Search validation
export const AISearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Type exports
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type CreateCandidateInput = z.infer<typeof CreateCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof UpdateCandidateSchema>;
export type MoveCandidateStageInput = z.infer<typeof MoveCandidateStageSchema>;
export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
export type AISearchInput = z.infer<typeof AISearchSchema>;

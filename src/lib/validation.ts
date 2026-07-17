import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  name: z.string().max(60).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email or username"),
  password: z.string().min(1, "Enter your password"),
});

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const submissionSchema = z.object({
  suspect: z.string().min(2, "Name the suspect").max(120),
  reasoning: z
    .string()
    .min(30, "Explain your reasoning in at least 30 characters")
    .max(5000),
});

export const caseSchema = z.object({
  title: z.string().min(3).max(160),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  summary: z.string().min(10).max(500),
  briefing: z.string().min(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
  reward: z.coerce.number().int().min(0).max(100000),
  coverImage: z.string().optional().or(z.literal("")),
  location: z.string().max(160).optional().or(z.literal("")),
  dateOccurred: z.string().max(80).optional().or(z.literal("")),
  status: z.enum(["OPEN", "CLOSED"]),
  featured: z.boolean().optional(),
  culprit: z.string().min(1).max(160),
  solutionSummary: z.string().min(1),
});

export const evidenceSchema = z.object({
  type: z.enum(["PHOTO", "VIDEO", "DOCUMENT", "FILE", "AUDIO"]),
  title: z.string().min(1).max(160),
  description: z.string().max(1000).optional().or(z.literal("")),
  url: z.string().min(1),
  fileName: z.string().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).optional(),
});

export const reviewSchema = z.object({
  status: z.enum(["CORRECT", "INCORRECT", "REVIEWED", "PENDING"]),
  score: z.coerce.number().int().min(0).max(100000),
  feedback: z.string().max(2000).optional().or(z.literal("")),
});

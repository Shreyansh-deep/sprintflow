import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const projectSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
});

export const issueCreateSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  projectId: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(), // will parse to Date
});

export const issueUpdateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

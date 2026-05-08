import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Please enter a valid email').trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['student', 'client'], 'Please select a role'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').trim(),
  description: z.string().min(20, 'Description must be at least 20 characters').trim(),
  skillsRequired: z.array(z.string().trim()).min(1, 'At least one skill is required'),
  budget: z.coerce.number().positive('Budget must be positive'),
  deadline: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date')
    .refine((val) => new Date(val) > new Date(), 'Deadline must be in the future'),
});

export const proposalSchema = z.object({
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters').trim(),
  proposedBudget: z.coerce.number().positive('Budget must be positive'),
  estimatedDuration: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  skills: z.array(z.string().trim()).optional(),
  education: z.string().optional(),
  university: z.string().optional(),
  portfolioLinks: z.array(z.string().url('Must be a valid URL')).optional(),
  phone: z.string().trim().optional(),
});

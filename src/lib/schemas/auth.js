import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100).optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, 'Password must include uppercase, lowercase, number and special character')
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean().optional()
});

export const jwtPayloadSchema = z.object({
    userId: z.number().int(),
    role: z.string(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    iat: z.number().optional(),
    exp: z.number().optional()
});
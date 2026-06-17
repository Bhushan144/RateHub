import { z } from 'zod';

export const updatePasswordSchema = z.object({
    body: z.object({
        password: z.string()
            .min(8, 'Password must be at least 8 characters long')
            .max(16, 'Password cannot exceed 16 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    })
});

export const submitRatingSchema = z.object({
    body: z.object({
        storeId: z.string().nonempty('Store ID is required'),
        score: z.number()
            .int('Score must be a whole number')
            .min(1, 'Score must be at least 1')
            .max(5, 'Score cannot exceed 5')
    })
});
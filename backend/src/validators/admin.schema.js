import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(20),
        email: z.string().email(),
        password: z.string().min(8).max(16)
            .regex(/[A-Z]/)
            .regex(/[^a-zA-Z0-9]/),
        address: z.string().max(400).nonempty(),
        role: z.enum(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'])
    })
});

export const createStoreSchema = z.object({
    body: z.object({
        name: z.string().nonempty('Store name is required'),
        email: z.string().email('Invalid store email'),
        address: z.string().max(400).nonempty('Store address is required'),
        ownerId: z.string().nonempty('Store owner ID is required')
    })
});
import { z } from 'zod'

export const userSchema = z.object({
    email: z.string().email('Invalid email address'),
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    role: z.enum(['admin', 'editor', 'viewer']),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
})

export type UserFormData = z.infer<typeof userSchema>

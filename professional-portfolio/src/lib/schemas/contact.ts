import { z } from 'zod'

export const contactSchema = z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    whatsapp_number: z.string().min(10, 'WhatsApp number must be at least 10 digits').optional(),
    message: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

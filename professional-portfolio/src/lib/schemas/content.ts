import { z } from 'zod'

export const contentSchema = z.object({
    section: z.enum(['home', 'kinsmen', 'collaborate']),
    content_type: z.enum(['text', 'media', 'social']),
    key: z.string().min(1, 'Key is required'),
    value: z.string().optional(),
    media_url: z.string().url().optional().or(z.literal('')),
    media_type: z.enum(['image', 'video']).optional(),
    position: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
})

export type ContentFormData = z.infer<typeof contentSchema>

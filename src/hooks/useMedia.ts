'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useMedia() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<Error | null>(null)

    const supabase = createClient()

    async function uploadFile(file: File): Promise<string> {
        try {
            setUploading(true)
            setProgress(0)
            setError(null)

            // Validate file
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
            if (!validTypes.includes(file.type)) {
                throw new Error('Invalid file type')
            }

            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File size must be less than 10MB')
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `media/${fileName}`

            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90))
            }, 100)

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('portfolio-media')
                .upload(filePath, file)

            clearInterval(progressInterval)

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-media')
                .getPublicUrl(filePath)

            setProgress(100)
            return publicUrl
        } catch (err) {
            setError(err as Error)
            throw err
        } finally {
            setUploading(false)
        }
    }

    async function deleteFile(url: string) {
        try {
            // Extract file path from URL
            const path = url.split('/').slice(-2).join('/')

            const { error: deleteError } = await supabase.storage
                .from('portfolio-media')
                .remove([path])

            if (deleteError) throw deleteError
        } catch (err) {
            setError(err as Error)
            throw err
        }
    }

    return {
        uploadFile,
        deleteFile,
        uploading,
        progress,
        error,
    }
}

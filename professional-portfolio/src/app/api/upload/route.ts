import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `media/${fileName}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('portfolio-media')
            .upload(filePath, file)

        if (error) throw error

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('portfolio-media')
            .getPublicUrl(filePath)

        return NextResponse.json({ url: publicUrl })
    } catch (error) {
        console.error('Upload API error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const url = searchParams.get('url')

        if (!url) {
            return NextResponse.json({ error: 'URL required' }, { status: 400 })
        }

        // Extract file path from URL
        const path = url.split('/').slice(-2).join('/')

        const { error } = await supabase.storage
            .from('portfolio-media')
            .remove([path])

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete file API error:', error)
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }
}

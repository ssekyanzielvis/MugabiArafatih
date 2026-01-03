import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('section_theme_settings')
            .select('*')
            .eq('is_active', true)
            .order('section', { ascending: true })

        if (error) {
            console.error('Error fetching section themes:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error in section-themes GET:', error)
        return NextResponse.json(
            { error: 'Failed to fetch section themes' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { section, theme_mode, contrast, saturation, brightness } = body

        // Validate required fields
        if (!section || !theme_mode) {
            return NextResponse.json(
                { error: 'Missing required fields: section and theme_mode' },
                { status: 400 }
            )
        }

        // Validate section values
        const validSections = ['header', 'home', 'kinsmen', 'collaborate', 'social_links', 'footer']
        if (!validSections.includes(section)) {
            return NextResponse.json(
                { error: 'Invalid section value' },
                { status: 400 }
            )
        }

        // Validate theme_mode values
        if (!['dark', 'light'].includes(theme_mode)) {
            return NextResponse.json(
                { error: 'Invalid theme_mode value' },
                { status: 400 }
            )
        }

        // Validate numeric ranges
        if (contrast !== undefined && (contrast < 0.5 || contrast > 2)) {
            return NextResponse.json(
                { error: 'Contrast must be between 0.5 and 2.0' },
                { status: 400 }
            )
        }

        if (saturation !== undefined && (saturation < 0 || saturation > 2)) {
            return NextResponse.json(
                { error: 'Saturation must be between 0.0 and 2.0' },
                { status: 400 }
            )
        }

        if (brightness !== undefined && (brightness < 0.5 || brightness > 1.5)) {
            return NextResponse.json(
                { error: 'Brightness must be between 0.5 and 1.5' },
                { status: 400 }
            )
        }

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Upsert the section theme settings (insert or update if exists)
        const { data, error } = await supabase
            .from('section_theme_settings')
            .upsert(
                {
                    section,
                    theme_mode,
                    contrast: contrast ?? 1.0,
                    saturation: saturation ?? 1.0,
                    brightness: brightness ?? 1.0,
                    updated_by: user.id,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'section,theme_mode',
                }
            )
            .select()

        if (error) {
            console.error('Error saving section theme:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in section-themes POST:', error)
        return NextResponse.json(
            { error: 'Failed to save section theme' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const section = searchParams.get('section')
        const theme_mode = searchParams.get('theme_mode')

        if (!section || !theme_mode) {
            return NextResponse.json(
                { error: 'Missing required parameters: section and theme_mode' },
                { status: 400 }
            )
        }

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Reset to defaults by updating the values
        const { data, error } = await supabase
            .from('section_theme_settings')
            .update({
                contrast: 1.0,
                saturation: 1.0,
                brightness: 1.0,
                updated_by: user.id,
                updated_at: new Date().toISOString(),
            })
            .eq('section', section)
            .eq('theme_mode', theme_mode)
            .select()

        if (error) {
            console.error('Error resetting section theme:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in section-themes DELETE:', error)
        return NextResponse.json(
            { error: 'Failed to reset section theme' },
            { status: 500 }
        )
    }
}

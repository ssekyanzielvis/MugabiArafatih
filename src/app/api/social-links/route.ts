import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('social_links')
            .select('*')
            .eq('is_active', true)
            .order('position', { ascending: true })

        if (error) {
            console.error('Error fetching social links:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error in social-links GET:', error)
        return NextResponse.json(
            { error: 'Failed to fetch social links' },
            { status: 500 }
        )
    }
}

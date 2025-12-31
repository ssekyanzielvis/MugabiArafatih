import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const range = searchParams.get('range') || '7days'
        const days = range === '7days' ? 7 : 30

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Get daily visits
        const { data: visits } = await supabase
            .from('daily_visits')
            .select('*')
            .gte('date', startDate.toISOString().split('T')[0])
            .order('date', { ascending: true })

        // Get page views
        const { data: pageViews } = await supabase
            .from('analytics')
            .select('page_path')
            .gte('created_at', startDate.toISOString())

        // Get device distribution
        const { data: devices } = await supabase
            .from('analytics')
            .select('device_type')
            .gte('created_at', startDate.toISOString())

        return NextResponse.json({
            visits: visits || [],
            pageViews: pageViews || [],
            devices: devices || [],
        })
    } catch (error) {
        console.error('Analytics API error:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { error } = await supabase.from('analytics').insert([
            {
                visitor_id: body.visitorId,
                page_path: body.pagePath,
                referrer: body.referrer,
                user_agent: body.userAgent,
                device_type: body.deviceType,
            },
        ])

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Analytics tracking error:', error)
        return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 })
    }
}

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

        console.log('📊 Analytics API received:', {
            visitorId: body.visitorId,
            pagePath: body.pagePath,
            deviceType: body.deviceType
        })

        // Insert analytics record with all available data
        const { data, error } = await supabase.from('analytics').insert([
            {
                visitor_id: body.visitorId,
                page_path: body.pagePath,
                referrer: body.referrer || null,
                user_agent: body.userAgent || null,
                device_type: body.deviceType || null,
                country: body.country || null,
                city: body.city || null,
                ip_address: body.ipAddress || null,
                session_duration: body.sessionDuration || 0,
            },
        ]).select()

        if (error) {
            console.error('❌ Analytics insert error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                supabaseError: error
            })
            
            return NextResponse.json({ 
                error: 'Database insert failed',
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                troubleshooting: {
                    step1: 'Verify analytics table exists in Supabase',
                    step2: 'Check RLS policies allow INSERT from anon users',
                    step3: 'Run supabase-setup.sql in SQL Editor',
                    step4: 'Run fix-rls-policies.sql in SQL Editor'
                }
            }, { status: 500 })
        }

        console.log('✅ Analytics tracked successfully:', data?.[0]?.id)
        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('❌ Analytics tracking error (catch block):', {
            message: error?.message,
            name: error?.name,
            stack: error?.stack,
            error: error
        })
        
        return NextResponse.json({ 
            error: 'Failed to track visit',
            message: error?.message || 'Unknown error',
            name: error?.name || 'Error',
            troubleshooting: {
                step1: 'Check browser console for detailed error',
                step2: 'Verify Supabase connection in .env.local',
                step3: 'Ensure analytics table exists',
                step4: 'Check RLS policies allow INSERT'
            }
        }, { status: 500 })
    }
}

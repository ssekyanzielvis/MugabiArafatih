'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAnalytics(timeRange: '7days' | '30days' = '7days') {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchAnalytics()
    }, [timeRange])

    async function fetchAnalytics() {
        try {
            setLoading(true)
            const days = timeRange === '7days' ? 7 : 30
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - days)

            const { data: visits } = await supabase
                .from('daily_visits')
                .select('*')
                .gte('date', startDate.toISOString().split('T')[0])
                .order('date', { ascending: true })

            const { data: pageViews } = await supabase
                .from('analytics')
                .select('page_path')
                .gte('created_at', startDate.toISOString())

            const { data: deviceData } = await supabase
                .from('analytics')
                .select('device_type')
                .gte('created_at', startDate.toISOString())

            setData({
                visits: visits || [],
                pageViews: pageViews || [],
                devices: deviceData || [],
            })
        } catch (err) {
            setError(err as Error)
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, error, refetch: fetchAnalytics }
}

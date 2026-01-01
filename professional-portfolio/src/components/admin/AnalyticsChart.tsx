'use client'

import { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { createClient } from '@/lib/supabase/client'
import { format, subDays } from 'date-fns'
import { TrendingUp, TrendingDown, Users, Eye, Clock, Activity, Monitor, Smartphone, Tablet, MapPin } from 'lucide-react'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

interface DailyVisit {
    date: string
    visits: number
    unique_visitors: number
    page_views: number
}

interface AnalyticsData {
    dailyVisits: DailyVisit[]
    pageViews: { path: string; count: number }[]
    devices: { type: string; count: number }[]
    locations: { location: string; count: number }[]
    totalVisits: number
    totalUnique: number
    totalPageViews: number
    avgDuration: number
    topReferrers: { referrer: string; count: number }[]
}

import { useAdminTheme } from './AdminThemeContext'

export default function AnalyticsChart() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)
    const [timeRange, setTimeRange] = useState<7 | 30>(7)
    const { theme } = useAdminTheme()

    const supabase = createClient()

    // B&W Palette for charts
    const chartConfig = {
        light: {
            stroke: '#000000',
            grid: '#e5e7eb',
            text: '#374151',
            palette: ['#000000', '#4b5563', '#9ca3af', '#d1d5db', '#000000']
        },
        dark: {
            stroke: '#ffffff',
            grid: '#1f2937',
            text: '#9ca3af',
            palette: ['#ffffff', '#9ca3af', '#4b5563', '#1f2937', '#ffffff']
        }
    }

    const currentColors = chartConfig[theme]

    useEffect(() => {
        fetchAnalyticsData()
    }, [timeRange])

    async function fetchAnalyticsData() {
        setLoading(true)
        setError(null) // Clear previous errors

        try {
            const startDate = format(subDays(new Date(), timeRange), 'yyyy-MM-dd')

            // Fetch daily visits
            const { data: dailyVisits, error: visitsError } = await supabase
                .from('daily_visits')
                .select('*')
                .gte('date', startDate)
                .order('date', { ascending: true })

            if (visitsError) {
                console.error('Error fetching daily visits:', visitsError)
                setError(visitsError)
                setLoading(false)
                return
            }

            // Fetch all analytics data for the period
            const { data: analyticsRecords, error: analyticsError } = await supabase
                .from('analytics')
                .select('*')
                .gte('created_at', startDate)

            if (analyticsError) {
                console.error('Error fetching analytics:', analyticsError)
                setError(analyticsError)
                setLoading(false)
                return
            }

            // Process page views
            const pageViewsMap: Record<string, number> = {}
            analyticsRecords?.forEach(record => {
                const path = record.page_path || 'Unknown'
                pageViewsMap[path] = (pageViewsMap[path] || 0) + 1
            })
            const pageViews = Object.entries(pageViewsMap)
                .map(([path, count]) => ({ path, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)

            // Process device distribution
            const devicesMap: Record<string, number> = {}
            analyticsRecords?.forEach(record => {
                const device = record.device_type || 'Unknown'
                devicesMap[device] = (devicesMap[device] || 0) + 1
            })
            const devices = Object.entries(devicesMap).map(([type, count]) => ({ type, count }))

            // Process locations
            const locationsMap: Record<string, number> = {}
            analyticsRecords?.forEach(record => {
                if (record.country) {
                    const location = record.city ? `${record.city}, ${record.country}` : record.country
                    locationsMap[location] = (locationsMap[location] || 0) + 1
                }
            })
            const locations = Object.entries(locationsMap)
                .map(([location, count]) => ({ location, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)

            // Process referrers
            const referrersMap: Record<string, number> = {}
            analyticsRecords?.forEach(record => {
                if (record.referrer && record.referrer !== 'direct') {
                    try {
                        const url = new URL(record.referrer)
                        const domain = url.hostname
                        referrersMap[domain] = (referrersMap[domain] || 0) + 1
                    } catch {
                        referrersMap[record.referrer] = (referrersMap[record.referrer] || 0) + 1
                    }
                }
            })
            const topReferrers = Object.entries(referrersMap)
                .map(([referrer, count]) => ({ referrer, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)

            // Calculate totals
            const totalVisits = dailyVisits?.reduce((sum, day) => sum + day.visits, 0) || 0
            const totalUnique = dailyVisits?.reduce((sum, day) => sum + day.unique_visitors, 0) || 0
            const totalPageViews = dailyVisits?.reduce((sum, day) => sum + day.page_views, 0) || 0
            
            // Calculate average session duration
            const validDurations = analyticsRecords?.filter(r => r.session_duration > 0).map(r => r.session_duration) || []
            const avgDuration = validDurations.length > 0
                ? Math.floor(validDurations.reduce((sum, dur) => sum + dur, 0) / validDurations.length)
                : 0

            setAnalyticsData({
                dailyVisits: dailyVisits || [],
                pageViews,
                devices,
                locations,
                totalVisits,
                totalUnique,
                totalPageViews,
                avgDuration,
                topReferrers,
            })
        } catch (error) {
            console.error('Error fetching analytics data:', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-10">
                <div className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20 p-8">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="inline-block p-3 border-2 border-red-500 bg-white dark:bg-black">
                                <Activity size={32} className="text-red-500" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold uppercase tracking-wide text-red-700 dark:text-red-400 mb-2">
                                Analytics Data Error
                            </h3>
                            <p className="text-sm font-medium text-red-600 dark:text-red-300 mb-4">
                                Unable to fetch analytics data from the database
                            </p>
                            
                            {/* Error Details */}
                            <div className="bg-white dark:bg-black border-2 border-red-500 p-4 mb-4 font-mono text-xs">
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-bold text-red-700 dark:text-red-400">Error Message:</span>
                                        <p className="text-red-600 dark:text-red-300 mt-1">{error.message || 'Unknown error'}</p>
                                    </div>
                                    {error.details && (
                                        <div>
                                            <span className="font-bold text-red-700 dark:text-red-400">Details:</span>
                                            <p className="text-red-600 dark:text-red-300 mt-1">{error.details}</p>
                                        </div>
                                    )}
                                    {error.hint && (
                                        <div>
                                            <span className="font-bold text-red-700 dark:text-red-400">Hint:</span>
                                            <p className="text-red-600 dark:text-red-300 mt-1">{error.hint}</p>
                                        </div>
                                    )}
                                    {error.code && (
                                        <div>
                                            <span className="font-bold text-red-700 dark:text-red-400">Error Code:</span>
                                            <p className="text-red-600 dark:text-red-300 mt-1">{error.code}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Troubleshooting Steps */}
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-500 p-4 mb-4">
                                <p className="font-bold uppercase tracking-wide text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                                    Troubleshooting Steps:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                                    <li className="font-medium">
                                        <span className="font-bold">Check Database Tables:</span> Verify that 'analytics' and 'daily_visits' tables exist in Supabase
                                    </li>
                                    <li className="font-medium">
                                        <span className="font-bold">Row Level Security (RLS):</span> Check if RLS policies allow SELECT on these tables
                                    </li>
                                    <li className="font-medium">
                                        <span className="font-bold">Table Schema:</span> Run the database-schema.sql or supabase-setup.sql script
                                    </li>
                                    <li className="font-medium">
                                        <span className="font-bold">Authentication:</span> Ensure you're logged in as an admin user
                                    </li>
                                    <li className="font-medium">
                                        <span className="font-bold">Environment Variables:</span> Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
                                    </li>
                                </ol>
                            </div>

                            {/* Retry Button */}
                            <button
                                onClick={() => fetchAnalyticsData()}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wide text-sm border-2 border-red-700 shadow-sm transition-all hover:scale-105"
                            >
                                Retry Loading Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="space-y-10">
                <div className="text-center py-12">
                    <div className="inline-block w-4 h-4 border-2 border-inherit border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60">Loading Analytics Data...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="admin-card p-6 animate-pulse">
                            <div className="h-4 bg-inherit border border-inherit opacity-20 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-inherit border border-inherit opacity-20 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!analyticsData) {
        return (
            <div className="text-center py-20 border-2 border-dashed" style={{ borderColor: 'var(--admin-border)' }}>
                <div className="inline-block p-4 border-2 mb-4" style={{ borderColor: 'var(--admin-border)' }}>
                    <Activity size={32} className="opacity-30" />
                </div>
                <p className="font-bold uppercase tracking-wide text-base mb-2">No Analytics Data Available</p>
                <p className="text-sm opacity-50 font-medium">Visit your website to start collecting data</p>
            </div>
        )
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    const formattedVisits = analyticsData.dailyVisits.map(day => ({
        date: format(new Date(day.date), 'MMM dd'),
        visits: day.visits,
        unique: day.unique_visitors,
        pageViews: day.page_views,
    }))

    return (
        <div className="space-y-10">
            {/* Time Range Selector */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60">Data Range</p>
                    <p className="text-xs opacity-40 mt-1 font-medium">Select time period for analysis</p>
                </div>
                <div className="inline-flex border-2 border-inherit bg-inherit p-1 shadow-sm">
                    <button
                        onClick={() => setTimeRange(7)}
                        className={`px-5 py-2.5 text-sm font-bold uppercase transition-all ${timeRange === 7
                            ? 'bg-inherit invert shadow-sm scale-105'
                            : 'hover:invert hover:scale-105'
                            }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setTimeRange(30)}
                        className={`px-5 py-2.5 text-sm font-bold uppercase transition-all ${timeRange === 30
                            ? 'bg-inherit invert shadow-sm scale-105'
                            : 'hover:invert hover:scale-105'
                            }`}
                    >
                        Last 30 Days
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="admin-card p-6 border-b-4 border-b-inherit hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase opacity-60 tracking-wider font-mono">Total Visits</p>
                        <div className="w-10 h-10 border-2 border-inherit flex items-center justify-center opacity-60">
                            <Eye size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-bold mt-3 font-mono tracking-tighter">{analyticsData.totalVisits}</p>
                    <p className="text-xs opacity-40 mt-2 font-medium">All page views</p>
                </div>

                <div className="admin-card p-6 border-b-4 border-b-inherit hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase opacity-60 tracking-wider font-mono">Unique Visitors</p>
                        <div className="w-10 h-10 border-2 border-inherit flex items-center justify-center opacity-60">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-bold mt-3 font-mono tracking-tighter">{analyticsData.totalUnique}</p>
                    <p className="text-xs opacity-40 mt-2 font-medium">Individual users</p>
                </div>

                <div className="admin-card p-6 border-b-4 border-b-inherit hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase opacity-60 tracking-wider font-mono">Page Views</p>
                        <div className="w-10 h-10 border-2 border-inherit flex items-center justify-center opacity-60">
                            <Activity size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-bold mt-3 font-mono tracking-tighter">{analyticsData.totalPageViews}</p>
                    <p className="text-xs opacity-40 mt-2 font-medium">Total impressions</p>
                </div>

                <div className="admin-card p-6 border-b-4 border-b-inherit hover:scale-105 transition-transform cursor-default">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase opacity-60 tracking-wider font-mono">Avg. Duration</p>
                        <div className="w-10 h-10 border-2 border-inherit flex items-center justify-center opacity-60">
                            <Clock size={20} />
                        </div>
                    </div>
                    <p className="text-4xl font-bold mt-3 font-mono tracking-tighter">{formatDuration(analyticsData.avgDuration)}</p>
                    <p className="text-xs opacity-40 mt-2 font-medium">Time on site</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Visits Line Chart */}
                <div className="admin-card p-8">
                    <h3 className="text-lg font-bold mb-8 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-3"></span>
                        Traffic Overview
                    </h3>
                    <p className="text-sm opacity-50 mb-6 font-medium -mt-6">Daily visitor trends and patterns</p>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedVisits}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e5e7eb' : '#1f2937'} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke={theme === 'light' ? '#000' : '#fff'} 
                                    fontSize={11}
                                    fontWeight={600}
                                />
                                <YAxis 
                                    stroke={theme === 'light' ? '#000' : '#fff'} 
                                    fontSize={11}
                                    fontWeight={600}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'light' ? '#fff' : '#000',
                                        border: `2px solid ${theme === 'light' ? '#000' : '#fff'}`,
                                        color: theme === 'light' ? '#000' : '#fff',
                                        fontWeight: 700,
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="visits"
                                    stroke={theme === 'light' ? '#000' : '#fff'}
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    name="Total Visits"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="unique"
                                    stroke={theme === 'light' ? '#666' : '#999'}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ r: 3 }}
                                    name="Unique Visitors"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="admin-card p-8">
                    <h3 className="text-lg font-bold mb-8 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-3"></span>
                        Device Distribution
                    </h3>
                    <p className="text-sm opacity-50 mb-6 font-medium -mt-6">What devices visitors use</p>
                    <div className="h-80 flex items-center justify-center">
                        {analyticsData.devices.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData.devices}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(props: any) => `${props.type} (${props.count})`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {analyticsData.devices.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === 0 ? (theme === 'light' ? '#000' : '#fff') :
                                                     index === 1 ? (theme === 'light' ? '#666' : '#999') :
                                                     theme === 'light' ? '#bbb' : '#444'}
                                                stroke={theme === 'light' ? '#000' : '#fff'}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: theme === 'light' ? '#fff' : '#000',
                                            border: `2px solid ${theme === 'light' ? '#000' : '#fff'}`,
                                            fontWeight: 700,
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="opacity-50">No device data</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Page Views and Locations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Top Pages */}
                <div className="admin-card p-8">
                    <h3 className="text-lg font-bold mb-8 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-3"></span>
                        Top Pages
                    </h3>
                    <p className="text-sm opacity-50 mb-6 font-medium -mt-6">Most visited pages</p>
                    {analyticsData.pageViews.length > 0 ? (
                        <div className="space-y-4">
                            {analyticsData.pageViews.map((page, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b-2 border-inherit pb-3 hover:pl-2 transition-all">
                                    <span className="font-mono text-sm font-medium">{page.path}</span>
                                    <span className="font-bold px-3 py-1 border border-inherit text-xs">{page.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed opacity-40" style={{ borderColor: 'var(--admin-border)' }}>
                            <p className="font-bold uppercase text-sm">No Page Data</p>
                        </div>
                    )}
                </div>

                {/* Top Locations */}
                <div className="admin-card p-8">
                    <h3 className="text-lg font-bold mb-8 uppercase tracking-widest flex items-center">
                        <MapPin size={16} className="mr-3" />
                        Top Locations
                    </h3>
                    <p className="text-sm opacity-50 mb-6 font-medium -mt-6">Geographic visitor distribution</p>
                    {analyticsData.locations.length > 0 ? (
                        <div className="space-y-4">
                            {analyticsData.locations.map((location, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b-2 border-inherit pb-3 hover:pl-2 transition-all">
                                    <span className="font-mono text-sm font-medium flex items-center">
                                        <MapPin size={14} className="mr-2 opacity-40" />
                                        {location.location}
                                    </span>
                                    <span className="font-bold px-3 py-1 border border-inherit text-xs">{location.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed opacity-40" style={{ borderColor: 'var(--admin-border)' }}>
                            <p className="font-bold uppercase text-sm">No Location Data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Top Referrers */}
            {analyticsData.topReferrers.length > 0 && (
                <div className="admin-card p-8 mt-8">
                    <h3 className="text-lg font-bold mb-8 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-3"></span>
                        Top Referrers
                    </h3>
                    <p className="text-sm opacity-50 mb-6 font-medium -mt-6">Traffic sources sending visitors</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analyticsData.topReferrers.map((referrer, idx) => (
                            <div key={idx} className="border-2 border-inherit p-5 hover:scale-105 transition-transform">
                                <p className="font-mono text-sm truncate font-medium">{referrer.referrer}</p>
                                <p className="font-bold mt-3 text-2xl font-mono">{referrer.count}</p>
                                <p className="text-xs opacity-40 mt-1 uppercase tracking-wide">visits</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

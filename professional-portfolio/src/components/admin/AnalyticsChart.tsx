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
import { predictFutureVisits, calculateGrowthRate } from '@/lib/utils/analytics'
import { TrendingUp, TrendingDown, Users, Eye, Clock, Activity } from 'lucide-react'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

interface AnalyticsData {
    visits: any[]
    pageViews: Record<string, number>
    devices: any[]
    totalVisits: number
    totalUnique: number
    avgDuration: string
    predictions: any[]
    growthRate: number
}

import { useAdminTheme } from './AdminThemeContext'

export default function AnalyticsChart() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days')
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

        const days = timeRange === '7days' ? 7 : 30
        const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd')

        const { data: visits } = await supabase
            .from('daily_visits')
            .select('*')
            .gte('date', startDate)
            .order('date', { ascending: true })

        const { data: pageViews } = await supabase
            .from('analytics')
            .select('page_path')
            .gte('created_at', startDate)

        const { data: deviceData } = await supabase
            .from('analytics')
            .select('device_type')
            .gte('created_at', startDate)

        // Process data
        const formattedVisits = visits?.map(day => ({
            date: format(new Date(day.date), 'MMM dd'),
            visits: day.visits,
            unique: day.unique_visitors,
        })) || []

        const pageViewCounts = pageViews?.reduce((acc: any, curr) => {
            acc[curr.page_path] = (acc[curr.page_path] || 0) + 1
            return acc
        }, {}) || {}

        const deviceDistribution = deviceData?.reduce((acc: any, curr) => {
            const device = curr.device_type || 'Unknown'
            acc[device] = (acc[device] || 0) + 1
            return acc
        }, {}) || {}

        const pieData = Object.entries(deviceDistribution).map(([name, value]) => ({
            name,
            value,
        }))

        const totalVisits = visits?.reduce((sum, day) => sum + day.visits, 0) || 0
        const totalUnique = visits?.reduce((sum, day) => sum + day.unique_visitors, 0) || 0

        // Calculate predictions
        const predictions = predictFutureVisits(formattedVisits, 7)

        // Calculate growth rate
        const lastWeekVisits = visits?.slice(-7).reduce((sum, day) => sum + day.visits, 0) || 0
        const previousWeekVisits = visits?.slice(-14, -7).reduce((sum, day) => sum + day.visits, 0) || 1
        const growthRate = calculateGrowthRate(lastWeekVisits, previousWeekVisits)

        setAnalyticsData({
            visits: formattedVisits,
            pageViews: pageViewCounts,
            devices: pieData,
            totalVisits,
            totalUnique,
            avgDuration: '2m 34s',
            predictions,
            growthRate,
        })
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="admin-card p-6 animate-pulse">
                            <div className="h-4 bg-inherit border border-inherit opacity-20 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-inherit border border-inherit opacity-20 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!analyticsData) return null

    return (
        <div className="space-y-8">
            {/* Time Range Selector */}
            <div className="flex justify-end">
                <div className="inline-flex border border-inherit bg-inherit p-1">
                    <button
                        onClick={() => setTimeRange('7days')}
                        className={`px-4 py-2 text-sm font-bold uppercase transition-colors ${timeRange === '7days'
                            ? 'bg-inherit invert shadow-none'
                            : 'hover:invert'
                            }`}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('30days')}
                        className={`px-4 py-2 text-sm font-bold uppercase transition-colors ${timeRange === '30days'
                            ? 'bg-inherit invert shadow-none'
                            : 'hover:invert'
                            }`}
                    >
                        30 Days
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Visits', value: analyticsData.totalVisits, icon: Eye, trend: analyticsData.growthRate },
                    { label: 'Unique Visitors', value: analyticsData.totalUnique, icon: Users, trend: 8 },
                    { label: 'Avg. Duration', value: analyticsData.avgDuration, icon: Clock, trend: 15 },
                    { label: 'Bounce Rate', value: '34%', icon: Activity, trend: -5 },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-6 border-b-4 border-b-inherit">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase opacity-60 tracking-wider font-mono">{stat.label}</p>
                                <p className="text-4xl font-bold mt-2 font-mono tracking-tighter">{stat.value}</p>
                            </div>
                            <div className="w-12 h-12 border border-inherit flex items-center justify-center">
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            {stat.trend >= 0 ? (
                                <TrendingUp size={16} />
                            ) : (
                                <TrendingDown size={16} />
                            )}
                            <span className="text-sm ml-1 font-bold">
                                {Math.abs(stat.trend).toFixed(1)}% {stat.trend >= 0 ? 'increase' : 'decrease'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visits Line Chart with Predictions */}
                <div className="admin-card p-6">
                    <h3 className="text-lg font-bold mb-6 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                        Traffic Overview
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...analyticsData.visits, ...analyticsData.predictions]}>
                                <CartesianGrid strokeDasharray="1 1" stroke={currentColors.grid} />
                                <XAxis dataKey="date" stroke={currentColors.text} fontSize={10} strokeWidth={2} />
                                <YAxis stroke={currentColors.text} fontSize={10} strokeWidth={2} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'light' ? '#fff' : '#000',
                                        border: `1px solid ${theme === 'light' ? '#000' : '#fff'}`,
                                        color: theme === 'light' ? '#000' : '#fff'
                                    }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Line
                                    type="stepAfter"
                                    dataKey="visits"
                                    stroke={currentColors.stroke}
                                    strokeWidth={3}
                                    dot={false}
                                    name="Visits"
                                />
                                <Line
                                    type="stepAfter"
                                    dataKey="unique"
                                    stroke={currentColors.stroke}
                                    strokeWidth={1}
                                    strokeDasharray="4 4"
                                    name="Unique"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="predicted"
                                    stroke={currentColors.stroke}
                                    strokeWidth={3}
                                    strokeDasharray="2 2"
                                    opacity={0.3}
                                    name="Forecast"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Distribution Pie Chart */}
                <div className="admin-card p-6">
                    <h3 className="text-lg font-bold mb-6 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                        System Origin
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.devices}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analyticsData.devices.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={currentColors.palette[index % currentColors.palette.length]}
                                            stroke={currentColors.stroke}
                                            strokeWidth={1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'light' ? '#fff' : '#000',
                                        border: `1px solid ${theme === 'light' ? '#000' : '#fff'}`,
                                        color: theme === 'light' ? '#000' : '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Page Views Bar Chart */}
            <div className="admin-card p-6">
                <h3 className="text-lg font-bold mb-6 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                    Page Popularity
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={Object.entries(analyticsData.pageViews).map(([path, views]) => ({ path, views }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke={currentColors.grid} />
                            <XAxis dataKey="path" stroke={currentColors.text} fontSize={10} strokeWidth={2} />
                            <YAxis stroke={currentColors.text} fontSize={10} strokeWidth={2} />
                            <Tooltip
                                cursor={{ fill: 'transparent', stroke: currentColors.stroke, strokeWidth: 1 }}
                                contentStyle={{
                                    backgroundColor: theme === 'light' ? '#fff' : '#000',
                                    border: `1px solid ${theme === 'light' ? '#000' : '#fff'}`,
                                    color: theme === 'light' ? '#000' : '#fff'
                                }}
                            />
                            <Bar
                                dataKey="views"
                                fill={currentColors.stroke}
                                stroke={currentColors.stroke}
                                strokeWidth={1}
                                name="Views"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

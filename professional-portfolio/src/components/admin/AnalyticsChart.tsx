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

export default function AnalyticsChart() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days')

    const supabase = createClient()

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
                        <div key={i} className="bg-white p-6 rounded-xl shadow animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
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
                <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
                    <button
                        onClick={() => setTimeRange('7days')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === '7days'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('30days')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === '30days'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        30 Days
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Visits</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">{analyticsData.totalVisits}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Eye className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        {analyticsData.growthRate >= 0 ? (
                            <TrendingUp className="text-green-600" size={16} />
                        ) : (
                            <TrendingDown className="text-red-600" size={16} />
                        )}
                        <span className={`text-sm ml-1 ${analyticsData.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(analyticsData.growthRate).toFixed(1)}% from last week
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Unique Visitors</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">{analyticsData.totalUnique}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <p className="text-green-600 text-sm mt-4">↑ 8% from last week</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Avg. Duration</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">{analyticsData.avgDuration}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-green-600" size={24} />
                        </div>
                    </div>
                    <p className="text-green-600 text-sm mt-4">↑ 15% from last week</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Bounce Rate</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">34%</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Activity className="text-orange-600" size={24} />
                        </div>
                    </div>
                    <p className="text-red-600 text-sm mt-4">↓ 5% from last week</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visits Line Chart with Predictions */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Visits Over Time & Predictions</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...analyticsData.visits, ...analyticsData.predictions]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6' }}
                                    name="Actual Visits"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="unique"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    dot={{ fill: '#8b5cf6' }}
                                    name="Unique Visitors"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="predicted"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ fill: '#10b981' }}
                                    name="Predicted"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Device Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.devices}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analyticsData.devices.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Page Views Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Page Views</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={Object.entries(analyticsData.pageViews).map(([path, views]) => ({ path, views }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="path" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="#3b82f6" name="Page Views" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

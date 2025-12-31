import { createClient } from '@/lib/supabase/server'
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch quick stats
    const { data: totalVisits } = await supabase
        .from('daily_visits')
        .select('visits')

    const { data: submissions } = await supabase
        .from('contact_submissions')
        .select('id', { count: 'exact' })

    const { data: content } = await supabase
        .from('website_content')
        .select('id', { count: 'exact' })

    const totalVisitsCount = totalVisits?.reduce((sum, day) => sum + day.visits, 0) || 0
    const submissionsCount = submissions?.length || 0
    const contentCount = content?.length || 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your portfolio.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Visits</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">{totalVisitsCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Contact Submissions</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">{submissionsCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Content Items</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">{contentCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Growth Rate</p>
                            <p className="text-3xl font-bold mt-2 text-gray-900">+12%</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/content"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <FileText className="text-blue-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900">Manage Content</h3>
                        <p className="text-sm text-gray-600 mt-1">Edit website content and media</p>
                    </Link>

                    <Link
                        href="/analytics"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                    >
                        <BarChart3 className="text-purple-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900">View Analytics</h3>
                        <p className="text-sm text-gray-600 mt-1">Check visitor statistics</p>
                    </Link>

                    <Link
                        href="/users"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                        <Users className="text-green-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900">Manage Users</h3>
                        <p className="text-sm text-gray-600 mt-1">Add or edit admin users</p>
                    </Link>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Contact Submissions</h2>
                <div className="space-y-3">
                    {submissionsCount === 0 ? (
                        <p className="text-gray-500 text-center py-8">No submissions yet</p>
                    ) : (
                        <p className="text-gray-600">View all submissions in the Analytics section</p>
                    )}
                </div>
            </div>
        </div>
    )
}

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
                <h1 className="text-3xl font-bold uppercase tracking-tighter">Dashboard</h1>
                <p className="opacity-60 mt-2 font-medium">Welcome back! Here's what's happening with your portfolio.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Visits', value: totalVisitsCount, icon: BarChart3 },
                    { label: 'Contact Submissions', value: submissionsCount, icon: Users },
                    { label: 'Content Items', value: contentCount, icon: FileText },
                    { label: 'Growth Rate', value: '+12%', icon: TrendingUp },
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
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="admin-card p-6">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/content"
                        className="p-6 border border-inherit transition-all hover:bg-inherit hover:invert"
                    >
                        <FileText className="mb-4" size={32} />
                        <h3 className="font-bold uppercase text-lg">Manage Content</h3>
                        <p className="text-sm opacity-70 mt-2">Edit website content and media</p>
                    </Link>

                    <Link
                        href="/admin/analytics"
                        className="p-6 border border-inherit transition-all hover:bg-inherit hover:invert"
                    >
                        <BarChart3 className="mb-4" size={32} />
                        <h3 className="font-bold uppercase text-lg">View Analytics</h3>
                        <p className="text-sm opacity-70 mt-2">Check visitor statistics</p>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="p-6 border border-inherit transition-all hover:bg-inherit hover:invert"
                    >
                        <Users className="mb-4" size={32} />
                        <h3 className="font-bold uppercase text-lg">Manage Users</h3>
                        <p className="text-sm opacity-70 mt-2">Add or edit admin users</p>
                    </Link>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="admin-card p-6">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                    Recent Activity
                </h2>
                <div className="space-y-3">
                    {submissionsCount === 0 ? (
                        <div className="text-center py-12 border border-dashed border-inherit opacity-40">
                            <p className="uppercase font-bold tracking-widest">No recent submissions</p>
                        </div>
                    ) : (
                        <p className="font-bold uppercase tracking-tight">View all submissions in the Analytics section</p>
                    )}
                </div>
            </div>
        </div>
    )
}

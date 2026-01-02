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
        <div className="space-y-8 max-w-7xl">
            {/* Header */}
            <div className="pb-6 border-b-2" style={{ borderColor: 'var(--admin-border)' }}>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Dashboard</h1>
                <p className="mt-2 font-medium opacity-70">Welcome back! Here's your portfolio overview.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Total Visits', value: totalVisitsCount, icon: BarChart3 },
                    { label: 'Contact Submissions', value: submissionsCount, icon: Users },
                    { label: 'Content Items', value: contentCount, icon: FileText },
                    { label: 'Growth Rate', value: '+12%', icon: TrendingUp },
                ].map((stat, idx) => (
                    <div key={idx} className="admin-card p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-xs font-bold uppercase opacity-60 tracking-wide mb-3">{stat.label}</p>
                                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                            </div>
                            <div className="w-12 h-12 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: 'var(--admin-border)' }}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="admin-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6 uppercase tracking-tight">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/content"
                        className="admin-button p-6 text-left flex flex-col items-start gap-4 h-full"
                    >
                        <div className="w-12 h-12 border-2 flex items-center justify-center" style={{ borderColor: 'var(--admin-bg)' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold uppercase text-base mb-2">Manage Content</h3>
                            <p className="text-sm opacity-70">Edit website content and media</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/analytics"
                        className="admin-button p-6 text-left flex flex-col items-start gap-4 h-full"
                    >
                        <div className="w-12 h-12 border-2 flex items-center justify-center" style={{ borderColor: 'var(--admin-bg)' }}>
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold uppercase text-base mb-2">View Analytics</h3>
                            <p className="text-sm opacity-70">Check visitor statistics</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="admin-button p-6 text-left flex flex-col items-start gap-4 h-full"
                    >
                        <div className="w-12 h-12 border-2 flex items-center justify-center" style={{ borderColor: 'var(--admin-bg)' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold uppercase text-base mb-2">Manage Users</h3>
                            <p className="text-sm opacity-70">Add or edit admin users</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="admin-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6 uppercase tracking-tight">
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    {submissionsCount === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed opacity-40" style={{ borderColor: 'var(--admin-border)' }}>
                            <p className="uppercase font-bold tracking-wide text-sm">No recent submissions</p>
                        </div>
                    ) : (
                        <div className="p-6 border-2" style={{ borderColor: 'var(--admin-border)' }}>
                            <p className="font-semibold mb-2">You have {submissionsCount} contact submission{submissionsCount !== 1 ? 's' : ''}</p>
                            <Link href="/admin/analytics" className="text-sm font-medium opacity-70 hover:opacity-100 underline">
                                View all in Analytics →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

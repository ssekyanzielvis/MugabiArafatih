'use client'

import AnalyticsChart from '@/components/admin/AnalyticsChart'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeDate } from '@/lib/utils/formatters'
import { Download } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'
export default function AnalyticsPage() {
    const [submissions, setSubmissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchSubmissions()
    }, [])

    async function fetchSubmissions() {
        const { data } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        setSubmissions(data || [])
        setLoading(false)
    }

    function exportToCSV() {
        try {
            if (submissions.length === 0) {
                showToast('info', 'No submissions to export')
                return
            }

            // Create CSV content
            const headers = ['Full Name', 'Email', 'WhatsApp Number', 'Status', 'Date']
            const csvRows = [
                headers.join(','),
                ...submissions.map(sub => [
                    `"${sub.full_name}"`,
                    `"${sub.email}"`,
                    `"${sub.whatsapp_number || ''}"`,
                    `"${sub.status || 'pending'}"`,
                    `"${new Date(sub.created_at).toLocaleString()}"`
                ].join(','))
            ]

            const csvContent = csvRows.join('\n')
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            
            link.setAttribute('href', url)
            link.setAttribute('download', `contact_submissions_${new Date().toISOString().split('T')[0]}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            showToast('success', 'Submissions exported successfully')
        } catch (error) {
            console.error('Export error:', error)
            showToast('error', 'Failed to export submissions')
        }
    }

    return (
        <div className="space-y-10 max-w-7xl">
            {/* Header */}
            <div className="pb-8 border-b-2" style={{ borderColor: 'var(--admin-border)' }}>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Analytics Dashboard</h1>
                <p className="mt-3 text-base font-medium opacity-70">Monitor visitor metrics, traffic insights, and contact submissions</p>
            </div>

            {/* Analytics Charts */}
            <div className="admin-card p-8 md:p-10">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-8 flex items-center">
                    <span className="w-2 h-2 bg-inherit invert mr-3"></span>
                    Visitor Analytics
                </h2>
                <AnalyticsChart />
            </div>

            {/* Contact Submissions */}
            <div className="admin-card p-8 md:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight flex items-center">
                            <span className="w-2 h-2 bg-inherit invert mr-3"></span>
                            Contact Submissions
                        </h2>
                        <p className="text-sm opacity-60 mt-2 font-medium">Recent inquiries from your website visitors</p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        disabled={submissions.length === 0}
                        className="admin-button flex items-center gap-2 px-5 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
                        title="Export all submissions to CSV file"
                    >
                        <Download size={18} />
                        <span className="font-bold uppercase">Export CSV</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 opacity-60 font-medium animate-pulse">
                        <div className="inline-block w-3 h-3 border-2 border-inherit border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-bold uppercase tracking-widest">Loading submissions...</p>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed" style={{ borderColor: 'var(--admin-border)' }}>
                        <div className="inline-block p-4 border-2 mb-4" style={{ borderColor: 'var(--admin-border)' }}>
                            <Download size={32} className="opacity-30" />
                        </div>
                        <p className="font-bold uppercase tracking-wide text-base mb-2">No Submissions Yet</p>
                        <p className="text-sm opacity-50 font-medium">Contact form submissions will appear here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto border-2" style={{ borderColor: 'var(--admin-border)' }}>
                        <table className="min-w-full divide-y-2" style={{ borderColor: 'var(--admin-border)' }}>
                            <thead style={{ backgroundColor: 'var(--admin-fg)', color: 'var(--admin-bg)' }}>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
                                        WhatsApp
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2" style={{ borderColor: 'var(--admin-border)' }}>
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="transition-colors" style={{ cursor: 'default' }}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold">{submission.full_name}</div>
                                            <div className="text-xs opacity-60 mt-1">{submission.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm opacity-70">
                                            {submission.whatsapp_number || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 border-2 text-xs font-bold uppercase tracking-wide inline-block" style={{ borderColor: 'var(--admin-border)' }}>
                                                {submission.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium opacity-60">
                                            {formatRelativeDate(submission.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import AnalyticsChart from '@/components/admin/AnalyticsChart'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeDate } from '@/lib/utils/formatters'

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

    return (
        <div className="space-y-10">
            <div className="border-b-4 border-inherit pb-6">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Analytics Terminal</h1>
                <p className="opacity-60 text-xs font-bold uppercase tracking-[0.2em] mt-2">Metrics Oversight and Transmission Log</p>
            </div>

            {/* Analytics Charts */}
            <div className="admin-card p-10">
                <AnalyticsChart />
            </div>

            {/* Contact Submissions */}
            <div className="admin-card p-10">
                <h2 className="text-xl font-black mb-8 uppercase tracking-widest flex items-center">
                    <span className="w-3 h-3 bg-inherit invert mr-3"></span>
                    Recent Inbound Signals
                </h2>

                {loading ? (
                    <div className="text-center py-12 opacity-60 italic uppercase tracking-widest font-bold">Synchronizing...</div>
                ) : submissions.length === 0 ? (
                    <p className="opacity-50 text-center py-12 font-bold uppercase tracking-widest text-xs">No active signals detected</p>
                ) : (
                    <div className="overflow-x-auto border-t-2 border-inherit">
                        <table className="min-w-full divide-y-2 divide-inherit">
                            <thead>
                                <tr className="bg-inherit invert text-inherit">
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                                        Sender
                                    </th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                                        Channel
                                    </th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                                        Priority
                                    </th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                                        Timestamp
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-inherit">
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-inherit hover:invert hover:cursor-crosshair transition-colors group">
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="text-sm font-black uppercase tracking-tight">{submission.full_name}</div>
                                            <div className="text-[10px] opacity-60 font-mono tracking-tighter">{submission.email}</div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap text-[10px] font-mono opacity-80">
                                            {submission.whatsapp_number || '---'}
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <span className={`px-4 py-1 border-2 font-black text-[10px] uppercase tracking-widest ${submission.status === 'pending' ? 'border-inherit opacity-40' :
                                                'border-inherit invert bg-inherit'
                                                }`}>
                                                {submission.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap text-[10px] font-bold opacity-60">
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

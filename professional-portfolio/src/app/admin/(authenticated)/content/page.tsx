'use client'

import { useState } from 'react'
import ContentEditor from '@/components/admin/ContentEditor'
import MediaUploader from '@/components/admin/MediaUploader'
import ContentList from '@/components/admin/ContentList'

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<'home' | 'kinsmen' | 'collaborate'>('home')
    const [refreshKey, setRefreshKey] = useState(0)

    const handleRefresh = () => setRefreshKey(prev => prev + 1)

    return (
        <div className="space-y-8 max-w-7xl">
            {/* Header */}
            <div className="pb-6 border-b-2" style={{ borderColor: 'var(--admin-border)' }}>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Content Management</h1>
                <p className="mt-2 font-medium opacity-70">Manage website content and media assets</p>
            </div>

            {/* Section Tabs */}
            <div className="border-b-2" style={{ borderColor: 'var(--admin-border)' }}>
                <nav className="flex gap-2 -mb-0.5">
                    {(['home', 'kinsmen', 'collaborate'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all border-b-2 ${activeTab === tab
                                ? 'border-current opacity-100'
                                : 'border-transparent opacity-50 hover:opacity-100'
                                }`}
                            style={activeTab === tab ? { borderColor: 'var(--admin-fg)' } : {}}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Existing Content */}
            <div>
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Current Content</h2>
                <ContentList key={refreshKey} section={activeTab} />
            </div>

            {/* Media Uploader */}
            <div className="admin-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6 uppercase tracking-tight">
                    Upload New Media
                </h2>
                <p className="text-sm opacity-70 mb-4">
                    Upload images or videos for the <strong>{activeTab}</strong> page. Media will appear in the LEFT column.
                </p>
                <MediaUploader section={activeTab} onUploadComplete={handleRefresh} />
            </div>

            {/* Content Editor */}
            <div className="admin-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6 uppercase tracking-tight">
                    Edit Text Content
                </h2>
                <p className="text-sm opacity-70 mb-4">
                    Update text content for the <strong>{activeTab}</strong> page. Text will appear in the RIGHT column.
                </p>
                <ContentEditor section={activeTab} />
            </div>
        </div>
    )
}

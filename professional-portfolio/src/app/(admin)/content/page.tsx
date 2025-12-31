'use client'

import { useState } from 'react'
import ContentEditor from '@/components/admin/ContentEditor'
import MediaUploader from '@/components/admin/MediaUploader'

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<'home' | 'kinsmen' | 'collaborate'>('home')

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                <p className="text-gray-600 mt-2">Manage your website content and media files</p>
            </div>

            {/* Section Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {(['home', 'kinsmen', 'collaborate'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Media Uploader */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Upload Media</h2>
                <MediaUploader />
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content
                </h2>
                <ContentEditor section={activeTab} />
            </div>
        </div>
    )
}

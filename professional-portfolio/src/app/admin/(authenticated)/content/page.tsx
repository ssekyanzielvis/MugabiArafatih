'use client'

import { useState } from 'react'
import ContentEditor from '@/components/admin/ContentEditor'
import MediaUploader from '@/components/admin/MediaUploader'

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<'home' | 'kinsmen' | 'collaborate'>('home')

    return (
        <div className="space-y-10">
            <div className="border-b-4 border-inherit pb-6">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Content Terminal</h1>
                <p className="opacity-60 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage System Data and Asset Blocks</p>
            </div>

            {/* Section Tabs */}
            <div className="border-b-4 border-inherit">
                <nav className="-mb-1 flex space-x-1">
                    {(['home', 'kinsmen', 'collaborate'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-6 px-10 font-black text-xs uppercase tracking-[0.3em] transition-all ${activeTab === tab
                                ? 'bg-inherit invert text-inherit'
                                : 'opacity-40 hover:opacity-100 hover:bg-inherit hover:invert text-inherit'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Media Uploader */}
            <div className="admin-card p-10">
                <h2 className="text-xl font-black mb-8 uppercase tracking-widest flex items-center">
                    <span className="w-3 h-3 bg-inherit invert mr-3"></span>
                    Asset Initialization
                </h2>
                <MediaUploader />
            </div>

            {/* Content Editor */}
            <div className="admin-card p-10">
                <h2 className="text-xl font-black mb-8 uppercase tracking-widest flex items-center">
                    <span className="w-3 h-3 bg-inherit invert mr-3"></span>
                    {activeTab} Registry
                </h2>
                <ContentEditor section={activeTab} />
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { Palette, Type, Layout } from 'lucide-react'

export default function SettingsPage() {
    const [primaryColor, setPrimaryColor] = useState('#60a5fa')
    const [secondaryColor, setSecondaryColor] = useState('#c084fc')
    const [fontFamily, setFontFamily] = useState('Inter')

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-tighter">Settings</h1>
                <p className="opacity-60 mt-2 font-medium">Customize your website appearance and preferences</p>
            </div>

            {/* Color Settings */}
            <div className="admin-card p-6">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 border border-inherit flex items-center justify-center">
                        <Palette size={20} />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest">Color Scheme</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-bold mb-3 uppercase opacity-60 tracking-widest">
                            Primary Color
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-16 h-16 border-4 border-inherit cursor-pointer bg-inherit"
                            />
                            <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="admin-input flex-1 px-4 py-3 font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-3 uppercase opacity-60 tracking-widest">
                            Secondary Color
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="w-16 h-16 border-4 border-inherit cursor-pointer bg-inherit"
                            />
                            <input
                                type="text"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="admin-input flex-1 px-4 py-3 font-mono"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Typography Settings */}
            <div className="admin-card p-6">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 border border-inherit flex items-center justify-center">
                        <Type size={20} />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest">Typography</h2>
                </div>

                <div>
                    <label className="block text-xs font-bold mb-3 uppercase opacity-60 tracking-widest">
                        Font Family
                    </label>
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="admin-input w-full md:w-1/2 px-4 py-3 bg-inherit"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                    </select>
                </div>
            </div>

            {/* Layout Settings */}
            <div className="admin-card p-6">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 border border-inherit flex items-center justify-center">
                        <Layout size={20} />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest">Layout</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold mb-3 uppercase opacity-60 tracking-widest">
                            Max Width
                        </label>
                        <select className="admin-input w-full md:w-1/2 px-4 py-3 bg-inherit">
                            <option value="1280px">1280px (Default)</option>
                            <option value="1440px">1440px (Wide)</option>
                            <option value="1920px">1920px (Full)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-3 uppercase opacity-60 tracking-widest">
                            Spacing
                        </label>
                        <select className="admin-input w-full md:w-1/2 px-4 py-3 bg-inherit">
                            <option value="compact">Compact</option>
                            <option value="normal">Normal (Default)</option>
                            <option value="relaxed">Relaxed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-start">
                <button className="admin-button px-12 py-4">
                    SAVE CHANGES
                </button>
            </div>
        </div>
    )
}

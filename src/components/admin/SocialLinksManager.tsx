'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Trash2, Plus, X, ExternalLink, Globe } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'
import { KNOWN_PLATFORMS, renderSocialIcon, formatSocialHref, getPlatformDisplayLabel } from '@/lib/socialPlatforms'

type SocialLink = {
    id: string
    platform: string
    url: string
    position: number
    is_active: boolean
}

export default function SocialLinksManager() {
    const [links, setLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    
    // Form state
    const [selectedPreset, setSelectedPreset] = useState<string>('instagram')
    const [customPlatformName, setCustomPlatformName] = useState('')
    const [url, setUrl] = useState('')
    const [position, setPosition] = useState(0)
    const [isActive, setIsActive] = useState(true)

    const supabase = createClient()

    const fetchLinks = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('social_links')
            .select('*')
            .order('position', { ascending: true })

        if (error) {
            console.error('Error fetching social links:', error)
            showToast('error', `Failed to load social links: ${error.message}`)
        } else {
            setLinks(data || [])
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    function resetForm() {
        setSelectedPreset('instagram')
        setCustomPlatformName('')
        setUrl('')
        setPosition(links.length > 0 ? Math.max(...links.map(l => l.position || 0)) + 1 : 0)
        setIsActive(true)
        setEditingId(null)
        setIsAdding(false)
    }

    function handleStartAdd() {
        setSelectedPreset('instagram')
        setCustomPlatformName('')
        setUrl('')
        setPosition(links.length > 0 ? Math.max(...links.map(l => l.position || 0)) + 1 : 0)
        setIsActive(true)
        setEditingId(null)
        setIsAdding(true)
    }

    function handleEdit(link: SocialLink) {
        setEditingId(link.id)
        const matchedPreset = KNOWN_PLATFORMS.find(p => p.value === link.platform.toLowerCase())
        if (matchedPreset && matchedPreset.value !== 'custom') {
            setSelectedPreset(matchedPreset.value)
            setCustomPlatformName('')
        } else {
            setSelectedPreset('custom')
            setCustomPlatformName(link.platform)
        }
        setUrl(link.url)
        setPosition(link.position || 0)
        setIsActive(link.is_active)
        setIsAdding(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const finalPlatform = selectedPreset === 'custom' 
            ? (customPlatformName.trim().toLowerCase() || 'custom') 
            : selectedPreset

        if (!finalPlatform) {
            showToast('error', 'Please select or enter a platform name')
            return
        }

        try {
            const linkData = {
                platform: finalPlatform,
                url: url.trim(),
                position: Number(position) || 0,
                is_active: isActive,
                updated_at: new Date().toISOString()
            }

            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from('social_links')
                    .update(linkData)
                    .eq('id', editingId)

                if (error) throw error
                showToast('success', 'Social link updated successfully!')
            } else {
                // Insert new
                const { error } = await supabase
                    .from('social_links')
                    .insert([linkData])

                if (error) throw error
                showToast('success', 'Social link added successfully!')
            }

            resetForm()
            fetchLinks()
        } catch (error: unknown) {
            console.error('Error saving social link:', error)
            let errorMsg = 'Unknown error'
            if (typeof error === 'object' && error !== null) {
                const err = error as Record<string, unknown>
                if (typeof err.message === 'string') {
                    errorMsg = err.message
                    if (typeof err.details === 'string' && err.details) {
                        errorMsg += `: ${err.details}`
                    }
                    if (typeof err.hint === 'string' && err.hint) {
                        errorMsg += ` (${err.hint})`
                    }
                }
            } else if (error instanceof Error) {
                errorMsg = error.message
            }

            if (errorMsg.toLowerCase().includes('constraint') || errorMsg.toLowerCase().includes('platform')) {
                showToast('error', `Database constraint error: Please run add-instagram-support.sql in Supabase SQL Editor. (${errorMsg})`)
            } else {
                showToast('error', `Failed to save: ${errorMsg}`)
            }
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this social link?')) return

        try {
            const { error } = await supabase
                .from('social_links')
                .delete()
                .eq('id', id)

            if (error) throw error
            showToast('success', 'Social link deleted successfully!')
            fetchLinks()
        } catch (error: unknown) {
            console.error('Error deleting social link:', error)
            let errorMsg = 'Unknown error'
            if (typeof error === 'object' && error !== null) {
                const err = error as Record<string, unknown>
                if (typeof err.message === 'string') {
                    errorMsg = err.message
                }
            } else if (error instanceof Error) {
                errorMsg = error.message
            }
            showToast('error', `Failed to delete: ${errorMsg}`)
        }
    }

    const currentPreset = KNOWN_PLATFORMS.find(p => p.value === selectedPreset)
    const effectivePlatformForIcon = selectedPreset === 'custom' ? (customPlatformName || 'globe') : selectedPreset

    if (loading) {
        return <div className="text-center py-8 opacity-60 italic uppercase tracking-widest font-bold">Loading Social Links...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-widest">Social Links</h2>
                    <p className="text-xs opacity-60 mt-1">Add as many social media profiles, channels, or custom links as needed.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={handleStartAdd}
                        className="admin-button flex items-center space-x-2 px-6 py-3"
                    >
                        <Plus size={20} />
                        <span>Add Social Link</span>
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="admin-card p-6">
                    <h3 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                        {editingId ? 'Edit Social Link' : 'Add Social Link'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase opacity-70">Platform</label>
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 border border-inherit flex items-center justify-center shrink-0">
                                        {renderSocialIcon(effectivePlatformForIcon, 'w-6 h-6')}
                                    </div>
                                    <select
                                        value={selectedPreset}
                                        onChange={(e) => setSelectedPreset(e.target.value)}
                                        className="admin-input w-full px-4 py-3 bg-inherit"
                                        required
                                    >
                                        {KNOWN_PLATFORMS.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {selectedPreset === 'custom' && (
                                <div>
                                    <label className="block text-sm font-bold mb-2 uppercase opacity-70">Custom Platform Name</label>
                                    <input
                                        type="text"
                                        value={customPlatformName}
                                        onChange={(e) => setCustomPlatformName(e.target.value)}
                                        className="admin-input w-full px-4 py-3"
                                        placeholder="e.g. Substack, Medium, Behance..."
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">URL / Handle / Link</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="admin-input w-full px-4 py-3"
                                placeholder={currentPreset?.placeholder || 'https://...'}
                                required
                            />
                            <p className="text-xs opacity-50 mt-1">
                                {selectedPreset === 'email' 
                                    ? 'Enter email address (e.g. hello@example.com)' 
                                    : selectedPreset === 'whatsapp' 
                                    ? 'Enter phone with country code or full https://wa.me/ link' 
                                    : 'Enter full URL (e.g. https://instagram.com/yourprofile)'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold mb-2 uppercase opacity-60 tracking-widest">
                                    Display Order (Position)
                                </label>
                                <input
                                    type="number"
                                    value={position}
                                    onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
                                    className="admin-input w-full px-4 py-3"
                                    min="0"
                                />
                            </div>

                            <div className="flex items-center pt-6">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="w-5 h-5 border-2 border-inherit bg-inherit checked:bg-inherit checked:invert appearance-none transition-all cursor-pointer"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                                        Active / Visible to Visitors
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                className="admin-button px-8 py-3 flex items-center space-x-2"
                            >
                                <Save size={18} />
                                <span>{editingId ? 'Update Link' : 'Add Link'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="admin-panel border-2 px-8 py-3 flex items-center space-x-2 hover:bg-inherit hover:invert transition-all"
                                style={{ borderColor: 'var(--admin-border)' }}
                            >
                                <X size={18} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Links List */}
            {!isAdding && (
                <div className="grid grid-cols-1 gap-4">
                    {links.length === 0 ? (
                        <div className="admin-card p-8 text-center opacity-60 border-2 border-dashed">
                            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm uppercase tracking-wider font-bold">No social links added yet</p>
                            <p className="text-xs opacity-60 mt-1">Click &quot;Add Social Link&quot; above to add Instagram, Facebook, YouTube, etc.</p>
                        </div>
                    ) : (
                        links.map((link) => {
                            const formattedHref = formatSocialHref(link.platform, link.url)
                            const displayLabel = getPlatformDisplayLabel(link.platform)

                            return (
                                <div
                                    key={link.id}
                                    className={`admin-card p-5 flex items-center justify-between border-l-8 ${link.is_active ? 'border-l-green-500' : 'border-l-gray-400 opacity-60'}`}
                                >
                                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                                        <div className="p-3 border border-inherit flex items-center justify-center shrink-0">
                                            {renderSocialIcon(link.platform, 'w-6 h-6')}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <span className="text-sm font-bold uppercase tracking-wider">
                                                    {displayLabel}
                                                </span>
                                                <span className="text-[10px] px-2 py-0.5 border border-inherit font-mono opacity-60">
                                                    Order: {link.position}
                                                </span>
                                                {!link.is_active && (
                                                    <span className="px-2 py-0.5 bg-inherit invert text-[10px] font-bold uppercase tracking-widest">
                                                        Hidden
                                                    </span>
                                                )}
                                            </div>
                                            <a 
                                                href={formattedHref} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="opacity-70 text-xs font-mono truncate flex items-center space-x-1 hover:underline hover:opacity-100"
                                            >
                                                <span>{link.url}</span>
                                                <ExternalLink size={12} className="inline ml-1 shrink-0 opacity-50" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ml-4 shrink-0">
                                        <button
                                            onClick={() => handleEdit(link)}
                                            className="p-3 border border-inherit hover:invert transition-all"
                                            title="Edit"
                                        >
                                            <Save size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(link.id)}
                                            className="p-3 border border-inherit hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}

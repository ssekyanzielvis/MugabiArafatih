'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Trash2, Plus, X } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'

type SocialLink = {
    id: string
    platform: 'email' | 'facebook' | 'tiktok' | 'youtube' | 'twitter'
    url: string
    position: number
    is_active: boolean
}

const PLATFORMS = [
    { value: 'email', label: 'Email', placeholder: 'your@email.com' },
    { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourprofile' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
    { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/yourchannel' },
    { value: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourprofile' },
] as const

export default function SocialLinksManager() {
    const [links, setLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    
    // Form state
    const [platform, setPlatform] = useState<string>('email')
    const [url, setUrl] = useState('')
    const [position, setPosition] = useState(0)
    const [isActive, setIsActive] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchLinks()
    }, [])

    async function fetchLinks() {
        setLoading(true)
        const { data, error } = await supabase
            .from('social_links')
            .select('*')
            .order('position', { ascending: true })

        if (error) {
            console.error('Error fetching social links:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            showToast('error', `Failed to load social links: ${error.message}`)
        } else {
            setLinks(data || [])
        }
        setLoading(false)
    }

    function resetForm() {
        setPlatform('email')
        setUrl('')
        setPosition(0)
        setIsActive(true)
        setEditingId(null)
        setIsAdding(false)
    }

    function handleEdit(link: SocialLink) {
        setEditingId(link.id)
        setPlatform(link.platform)
        setUrl(link.url)
        setPosition(link.position)
        setIsActive(link.is_active)
        setIsAdding(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            const linkData = {
                platform,
                url,
                position,
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
        } catch (error: any) {
            console.error('Error saving social link:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            const errorMsg = error.message || error.hint || error.details || 'Unknown error'
            showToast('error', `Failed to save: ${errorMsg}`)
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
        } catch (error: any) {
            console.error('Error deleting social link:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            showToast('error', `Failed to delete: ${error.message || 'Unknown error'}`)
        }
    }

    if (loading) {
        return <div className="text-center py-8 opacity-60 italic uppercase tracking-widest font-bold">Loading Social Links...</div>
    }

    const usedPlatforms = links.map(link => link.platform)
    const availablePlatforms = PLATFORMS.filter(p => !usedPlatforms.includes(p.value as any) || editingId)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold uppercase tracking-widest">Social Links</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="admin-button flex items-center space-x-2 px-6 py-3"
                        disabled={availablePlatforms.length === 0}
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
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Platform</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="admin-input w-full px-4 py-3 bg-inherit"
                                required
                                disabled={!!editingId}
                            >
                                {editingId ? (
                                    <option value={platform}>
                                        {PLATFORMS.find(p => p.value === platform)?.label}
                                    </option>
                                ) : (
                                    availablePlatforms.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))
                                )}
                            </select>
                            {editingId && (
                                <p className="text-xs opacity-50 mt-1">Platform cannot be changed when editing</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">URL / Value</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="admin-input w-full px-4 py-3"
                                placeholder={PLATFORMS.find(p => p.value === platform)?.placeholder}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold mb-2 uppercase opacity-60 tracking-widest">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={position}
                                    onChange={(e) => setPosition(parseInt(e.target.value))}
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
                                        Active/Published
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
                        <div className="admin-card p-8 text-center opacity-60">
                            <p className="text-sm uppercase tracking-wider">No social links added yet</p>
                        </div>
                    ) : (
                        links.map((link) => (
                            <div
                                key={link.id}
                                className="admin-card p-6 flex items-center justify-between border-l-8 border-l-inherit"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <span className="px-3 py-1 border border-inherit text-[10px] font-bold uppercase tracking-widest">
                                            {PLATFORMS.find(p => p.value === link.platform)?.label}
                                        </span>
                                        <span className="text-xs opacity-40 font-mono">Position: {link.position}</span>
                                        {!link.is_active && (
                                            <span className="px-3 py-1 bg-inherit invert text-[10px] font-bold uppercase tracking-widest">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="opacity-70 text-sm font-mono break-all">{link.url}</p>
                                </div>
                                <div className="flex space-x-2 ml-6">
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
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

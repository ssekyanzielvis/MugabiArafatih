'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, Edit2, Trash2, X } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'
import Image from 'next/image'

interface ContentListProps {
    section: 'home' | 'kinsmen' | 'collaborate'
}

export default function ContentList({ section }: ContentListProps) {
    const [textContent, setTextContent] = useState<any>(null)
    const [mediaContent, setMediaContent] = useState<any[]>([])
    const [socialLinks, setSocialLinks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [previewItem, setPreviewItem] = useState<any>(null)
    const [editingItem, setEditingItem] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchContent()
    }, [section])

    const fetchContent = async () => {
        setLoading(true)
        try {
            // Fetch text content
            const { data: textData } = await supabase
                .from(`${section}_content`)
                .select('*')
                .eq('is_active', true)
                .single()

            setTextContent(textData)

            // Fetch media content
            const { data: mediaData } = await supabase
                .from(`${section}_media`)
                .select('*')
                .eq('is_active', true)
                .order('position', { ascending: true })

            setMediaContent(mediaData || [])

            // Fetch social links if collaborate section
            if (section === 'collaborate') {
                const { data: socialData } = await supabase
                    .from('social_links')
                    .select('*')
                    .eq('is_active', true)
                    .order('position', { ascending: true })

                setSocialLinks(socialData || [])
            }
        } catch (error) {
            console.error('Error fetching content:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteMedia = async (id: string) => {
        if (!confirm('Are you sure you want to delete this media?')) return

        const { error } = await supabase
            .from(`${section}_media`)
            .delete()
            .eq('id', id)

        if (error) {
            showToast('error', 'Failed to delete media')
        } else {
            showToast('success', 'Media deleted successfully')
            fetchContent()
        }
    }

    const handleDeleteSocialLink = async (id: string) => {
        if (!confirm('Are you sure you want to delete this social link?')) return

        const { error } = await supabase
            .from('social_links')
            .delete()
            .eq('id', id)

        if (error) {
            showToast('error', 'Failed to delete social link')
        } else {
            showToast('success', 'Social link deleted successfully')
            fetchContent()
        }
    }

    const handleEditMedia = async (item: any, newCaption: string) => {
        const { error } = await supabase
            .from(`${section}_media`)
            .update({ caption: newCaption })
            .eq('id', item.id)

        if (error) {
            showToast('error', 'Failed to update media')
        } else {
            showToast('success', 'Media updated successfully')
            setEditingItem(null)
            fetchContent()
        }
    }

    if (loading) {
        return <div className="text-center py-8" style={{ color: 'var(--admin-fg)' }}>Loading content...</div>
    }

    return (
        <div className="space-y-8">
            {/* Text Content */}
            <div className="admin-card p-6">
                <h3 className="text-xl font-bold mb-4 uppercase" style={{ color: 'var(--admin-fg)' }}>
                    Text Content
                </h3>
                {textContent ? (
                    <div className="space-y-4">
                        {section === 'home' && (
                            <>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Welcome Message</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.welcome_message || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Full Name</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.full_name || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Short Name</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.short_name || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Description</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.description || 'Not set'}
                                    </p>
                                </div>
                            </>
                        )}
                        {section === 'kinsmen' && (
                            <>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Definition</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.definition || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Title</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.title || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Description</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.description || 'Not set'}
                                    </p>
                                </div>
                            </>
                        )}
                        {section === 'collaborate' && (
                            <>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Title</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.title || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-bold opacity-70">Description</label>
                                    <p className="mt-1 p-3 border-2" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-fg)' }}>
                                        {textContent.description || 'Not set'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="opacity-50" style={{ color: 'var(--admin-fg)' }}>No text content available</p>
                )}
            </div>

            {/* Media Content */}
            <div className="admin-card p-6">
                <h3 className="text-xl font-bold mb-4 uppercase" style={{ color: 'var(--admin-fg)' }}>
                    Media Files ({mediaContent.length})
                </h3>
                {mediaContent.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mediaContent.map((media) => (
                            <div key={media.id} className="border-2 p-4 space-y-3" style={{ borderColor: 'var(--admin-border)' }}>
                                {media.media_type === 'image' ? (
                                    <div className="relative h-40 border-2" style={{ borderColor: 'var(--admin-border)' }}>
                                        <Image
                                            src={media.media_url}
                                            alt={media.caption || 'Media'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <video src={media.media_url} className="w-full h-40 object-cover" />
                                )}
                                <p className="text-sm font-bold" style={{ color: 'var(--admin-fg)' }}>{media.caption || 'No caption'}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPreviewItem(media)}
                                        className="flex-1 px-3 py-2 border-2 font-bold text-sm hover:opacity-70 transition-opacity"
                                        style={{ borderColor: 'var(--admin-fg)', color: 'var(--admin-fg)' }}
                                    >
                                        <Eye className="w-4 h-4 inline mr-1" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => setEditingItem(media)}
                                        className="flex-1 px-3 py-2 border-2 font-bold text-sm hover:opacity-70 transition-opacity"
                                        style={{ borderColor: 'var(--admin-fg)', color: 'var(--admin-fg)' }}
                                    >
                                        <Edit2 className="w-4 h-4 inline mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMedia(media.id)}
                                        className="px-3 py-2 border-2 border-red-500 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="opacity-50" style={{ color: 'var(--admin-fg)' }}>No media files uploaded</p>
                )}
            </div>

            {/* Social Links (Collaborate Section Only) */}
            {section === 'collaborate' && (
                <div className="admin-card p-6">
                    <h3 className="text-xl font-bold mb-4 uppercase" style={{ color: 'var(--admin-fg)' }}>
                        Social Links ({socialLinks.length})
                    </h3>
                    {socialLinks.length > 0 ? (
                        <div className="space-y-2">
                            {socialLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between p-3 border-2" style={{ borderColor: 'var(--admin-border)' }}>
                                    <div>
                                        <p className="font-bold uppercase" style={{ color: 'var(--admin-fg)' }}>{link.platform}</p>
                                        <p className="text-sm opacity-70" style={{ color: 'var(--admin-fg)' }}>{link.url}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSocialLink(link.id)}
                                        className="px-3 py-2 border-2 border-red-500 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="opacity-50" style={{ color: 'var(--admin-fg)' }}>No social links added</p>
                    )}
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
                    <div className="max-w-4xl w-full admin-card p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold uppercase" style={{ color: 'var(--admin-fg)' }}>Preview</h3>
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="p-2 hover:opacity-70"
                                style={{ color: 'var(--admin-fg)' }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {previewItem.media_type === 'image' ? (
                            <div className="relative w-full h-[500px]">
                                <Image
                                    src={previewItem.media_url}
                                    alt={previewItem.caption || 'Preview'}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <video src={previewItem.media_url} controls className="w-full max-h-[500px]" />
                        )}
                        <p className="mt-4 font-medium" style={{ color: 'var(--admin-fg)' }}>{previewItem.caption || 'No caption'}</p>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
                    <div className="max-w-lg w-full admin-card p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold uppercase" style={{ color: 'var(--admin-fg)' }}>Edit Caption</h3>
                            <button
                                onClick={() => setEditingItem(null)}
                                className="p-2 hover:opacity-70"
                                style={{ color: 'var(--admin-fg)' }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                handleEditMedia(editingItem, formData.get('caption') as string)
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--admin-fg)' }}>Caption</label>
                                <input
                                    type="text"
                                    name="caption"
                                    defaultValue={editingItem.caption || ''}
                                    className="w-full px-4 py-3 border-2 font-medium"
                                    style={{
                                        borderColor: 'var(--admin-border)',
                                        backgroundColor: 'var(--admin-bg)',
                                        color: 'var(--admin-fg)'
                                    }}
                                    placeholder="Enter caption..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 border-2 font-bold uppercase tracking-wide hover:opacity-70 transition-opacity"
                                    style={{
                                        borderColor: 'var(--admin-fg)',
                                        backgroundColor: 'var(--admin-fg)',
                                        color: 'var(--admin-bg)'
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-6 py-3 border-2 font-bold uppercase tracking-wide hover:opacity-70 transition-opacity"
                                    style={{ borderColor: 'var(--admin-fg)', color: 'var(--admin-fg)' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

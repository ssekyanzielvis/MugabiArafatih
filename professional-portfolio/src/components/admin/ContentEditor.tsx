'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'

interface ContentEditorProps {
    section: 'home' | 'kinsmen' | 'collaborate'
    onSave?: () => void
}

type HomeContentData = {
    welcome_message: string
    full_name: string
    short_name: string
    description: string
}

type KinsmenContentData = {
    definition: string
    title: string
    description: string
}

type CollaborateContentData = {
    title: string
    description: string
}

export default function ContentEditor({ section, onSave }: ContentEditorProps) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [contentId, setContentId] = useState<string | null>(null)
    
    // Home section state
    const [homeData, setHomeData] = useState<HomeContentData>({
        welcome_message: '',
        full_name: '',
        short_name: '',
        description: ''
    })
    
    // Kinsmen section state
    const [kinsmenData, setKinsmenData] = useState<KinsmenContentData>({
        definition: '',
        title: '',
        description: ''
    })
    
    // Collaborate section state
    const [collaborateData, setCollaborateData] = useState<CollaborateContentData>({
        title: '',
        description: ''
    })

    const supabase = createClient()

    useEffect(() => {
        fetchContent()
    }, [section])

    async function fetchContent() {
        setLoading(true)
        const tableName = `${section}_content`
        
        try {
            console.log(`Fetching content from ${tableName}...`)
            
            // Get the most recent active content (or first one if multiple exist)
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (error) {
                console.error(`Error fetching ${section} content:`, {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                })
                showToast('error', `Error loading content: ${error.message}`)
            } else if (data) {
                console.log(`${section} content fetched:`, data)
                setContentId(data.id)
                
                if (section === 'home') {
                    setHomeData({
                        welcome_message: data.welcome_message || '',
                        full_name: data.full_name || '',
                        short_name: data.short_name || '',
                        description: data.description || ''
                    })
                } else if (section === 'kinsmen') {
                    setKinsmenData({
                        definition: data.definition || '',
                        title: data.title || '',
                        description: data.description || ''
                    })
                } else if (section === 'collaborate') {
                    setCollaborateData({
                        title: data.title || '',
                        description: data.description || ''
                    })
                }
            } else {
                console.log(`No ${section} content found - will create new on save`)
            }
        } catch (err) {
            console.error(`Unexpected error fetching ${section} content:`, err)
            showToast('error', `Failed to load content`)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        
        try {
            const tableName = `${section}_content`
            let dataToSave: any = {}
            
            if (section === 'home') {
                dataToSave = homeData
            } else if (section === 'kinsmen') {
                dataToSave = kinsmenData
            } else if (section === 'collaborate') {
                dataToSave = collaborateData
            }
            
            dataToSave.is_active = true

            console.log(`Saving ${section} content:`, dataToSave)

            if (contentId) {
                // Update existing content
                const { data, error } = await supabase
                    .from(tableName)
                    .update(dataToSave)
                    .eq('id', contentId)
                    .select()
                    .single()
                
                if (error) {
                    console.error(`Error updating ${section} content:`, {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code
                    })
                    throw error
                }
                console.log(`${section} content updated:`, data)
                showToast('success', 'Content updated successfully!')
            } else {
                // Insert new content
                const { data, error } = await supabase
                    .from(tableName)
                    .insert([dataToSave])
                    .select()
                    .single()
                
                if (error) {
                    console.error(`Error creating ${section} content:`, {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code
                    })
                    throw error
                }
                
                if (data) {
                    setContentId(data.id)
                    console.log(`${section} content created:`, data)
                }
                showToast('success', 'Content created successfully!')
            }
            
            if (onSave) onSave()
            
            // Refresh content after save
            await fetchContent()
        } catch (error: any) {
            console.error('Error saving content:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                full: error
            })
            const errorMsg = error.message || error.hint || error.details || 'Unknown error'
            showToast('error', `Failed to save: ${errorMsg}`)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="text-center py-8 opacity-60 italic uppercase tracking-widest font-bold">Loading Content...</div>
    }

    return (
        <div className="admin-card p-6">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center">
                <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                {section.charAt(0).toUpperCase() + section.slice(1)} Content
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {section === 'home' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Welcome Message</label>
                            <textarea
                                value={homeData.welcome_message}
                                onChange={(e) => setHomeData({ ...homeData, welcome_message: e.target.value })}
                                rows={3}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter welcome message..."
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Full Name</label>
                            <input
                                type="text"
                                value={homeData.full_name}
                                onChange={(e) => setHomeData({ ...homeData, full_name: e.target.value })}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter your full name..."
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Short Name</label>
                            <input
                                type="text"
                                value={homeData.short_name}
                                onChange={(e) => setHomeData({ ...homeData, short_name: e.target.value })}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter short name or initials..."
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Professional Description</label>
                            <textarea
                                value={homeData.description}
                                onChange={(e) => setHomeData({ ...homeData, description: e.target.value })}
                                rows={5}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter your professional description..."
                                required
                            />
                        </div>
                    </>
                )}
                
                {section === 'kinsmen' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Definition</label>
                            <textarea
                                value={kinsmenData.definition}
                                onChange={(e) => setKinsmenData({ ...kinsmenData, definition: e.target.value })}
                                rows={4}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter the definition of kinsmen..."
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Title</label>
                            <input
                                type="text"
                                value={kinsmenData.title}
                                onChange={(e) => setKinsmenData({ ...kinsmenData, title: e.target.value })}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter title..."
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Detailed Description</label>
                            <textarea
                                value={kinsmenData.description}
                                onChange={(e) => setKinsmenData({ ...kinsmenData, description: e.target.value })}
                                rows={6}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter detailed description..."
                                required
                            />
                        </div>
                    </>
                )}
                
                {section === 'collaborate' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Collaboration Title</label>
                            <input
                                type="text"
                                value={collaborateData.title}
                                onChange={(e) => setCollaborateData({ ...collaborateData, title: e.target.value })}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter collaboration title..."
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2 uppercase opacity-70">Collaboration Description</label>
                            <textarea
                                value={collaborateData.description}
                                onChange={(e) => setCollaborateData({ ...collaborateData, description: e.target.value })}
                                rows={6}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter collaboration description..."
                                required
                            />
                        </div>
                    </>
                )}
                
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="admin-button px-8 py-3 flex items-center space-x-2 disabled:opacity-50"
                    >
                        <Save size={18} />
                        <span>{saving ? 'Saving...' : contentId ? 'Update Content' : 'Save Content'}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

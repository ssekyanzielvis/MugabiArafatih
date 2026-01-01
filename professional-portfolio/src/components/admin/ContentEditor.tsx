'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contentSchema, type ContentFormData } from '@/lib/schemas/content'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react'

interface ContentEditorProps {
    section: 'home' | 'kinsmen' | 'collaborate'
}

export default function ContentEditor({ section }: ContentEditorProps) {
    const [content, setContent] = useState<any[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        defaultValues: { section, content_type: 'text', is_active: true, position: 0 },
    })

    useEffect(() => {
        fetchContent()
    }, [section])

    async function fetchContent() {
        setLoading(true)
        const { data } = await supabase
            .from('website_content')
            .select('*')
            .eq('section', section)
            .order('position', { ascending: true })

        setContent(data || [])
        setLoading(false)
    }

    async function onSubmit(data: ContentFormData) {
        try {
            if (editingId) {
                await supabase
                    .from('website_content')
                    .update(data)
                    .eq('id', editingId)
            } else {
                await supabase
                    .from('website_content')
                    .insert([{ ...data, section }])
            }

            fetchContent()
            reset({ section, content_type: 'text', is_active: true, position: 0 })
            setEditingId(null)
            setIsAdding(false)
        } catch (error) {
            console.error('Error saving content:', error)
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this content?')) {
            await supabase.from('website_content').delete().eq('id', id)
            fetchContent()
        }
    }

    function handleEdit(item: any) {
        setEditingId(item.id)
        setIsAdding(true)
        reset(item)
    }

    function handleCancel() {
        setEditingId(null)
        setIsAdding(false)
        reset({ section, content_type: 'text', is_active: true, position: 0 })
    }

    if (loading) {
        return <div className="text-center py-8 opacity-60 italic uppercase tracking-widest font-bold">Loading Content...</div>
    }

    return (
        <div className="space-y-6">
            {/* Add New Button */}
            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="admin-button flex items-center space-x-2 px-6 py-3"
                >
                    <Plus size={20} />
                    <span>Add New Content</span>
                </button>
            )}

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="admin-card p-6">
                    <h3 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-inherit invert mr-2"></span>
                        {editingId ? 'Edit Record' : 'Create New Record'}
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold mb-2 uppercase opacity-60 tracking-widest">
                                    Type
                                </label>
                                <select
                                    {...register('content_type')}
                                    className="admin-input w-full px-4 py-3 bg-inherit"
                                >
                                    <option value="text">Text</option>
                                    <option value="media">Media</option>
                                    <option value="social">Social</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 uppercase opacity-60 tracking-widest">
                                    Identifier Key
                                </label>
                                <input
                                    {...register('key')}
                                    type="text"
                                    className="admin-input w-full px-4 py-3"
                                    placeholder="e.g., HERO_TITLE"
                                />
                                {errors.key && (
                                    <p className="mt-1 text-xs text-red-500 font-bold uppercase">{errors.key.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-2 uppercase opacity-60 tracking-widest">
                                Data Value
                            </label>
                            <textarea
                                {...register('value')}
                                rows={4}
                                className="admin-input w-full px-4 py-3"
                                placeholder="Enter content value..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold mb-2 uppercase opacity-60 tracking-widest">
                                    Sequence
                                </label>
                                <input
                                    {...register('position', { valueAsNumber: true })}
                                    type="number"
                                    className="admin-input w-full px-4 py-3"
                                    placeholder="0"
                                />
                            </div>

                            <div className="flex items-center pt-6">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        {...register('is_active')}
                                        type="checkbox"
                                        className="w-5 h-5 border-2 border-inherit bg-inherit checked:bg-inherit checked:invert appearance-none transition-all cursor-pointer"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">Published</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                className="admin-button px-8 py-3 flex items-center space-x-2"
                            >
                                <Save size={18} />
                                <span>Commit</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="admin-panel border border-inherit px-8 py-3 flex items-center space-x-2 hover:invert transition-all"
                            >
                                <X size={18} />
                                <span>Discard</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Content List */}
            <div className="grid grid-cols-1 gap-4">
                {content.map((item) => (
                    <div
                        key={item.id}
                        className="admin-card p-6 flex items-start justify-between border-l-8 border-l-inherit"
                    >
                        <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                                <span className="px-3 py-1 border border-inherit text-[10px] font-bold uppercase tracking-widest">
                                    {item.content_type}
                                </span>
                                <span className="font-mono font-bold tracking-tighter text-lg">{item.key}</span>
                                {!item.is_active && (
                                    <span className="px-3 py-1 bg-inherit invert text-[10px] font-bold uppercase tracking-widest">
                                        Draft
                                    </span>
                                )}
                            </div>
                            <p className="opacity-70 text-sm leading-relaxed max-w-2xl">{item.value}</p>
                            {item.media_url && (
                                <div className="mt-4 p-2 border border-inherit inline-block">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Attached: {item.media_url}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col space-y-2 ml-6">
                            <button
                                onClick={() => handleEdit(item)}
                                className="p-3 border border-inherit hover:invert transition-all"
                                title="Edit"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-3 border border-inherit hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

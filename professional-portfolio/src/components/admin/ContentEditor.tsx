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
        defaultValues: { section, content_type: 'text', is_active: true },
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
            reset({ section, content_type: 'text', is_active: true })
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
        reset({ section, content_type: 'text', is_active: true })
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div className="space-y-6">
            {/* Add New Button */}
            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add New Content</span>
                </button>
            )}

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Edit Content' : 'Add New Content'}
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content Type
                                </label>
                                <select
                                    {...register('content_type')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="text">Text</option>
                                    <option value="media">Media</option>
                                    <option value="social">Social</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Key
                                </label>
                                <input
                                    {...register('key')}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., welcome, title, description"
                                />
                                {errors.key && (
                                    <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Value
                            </label>
                            <textarea
                                {...register('value')}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Content value"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position
                                </label>
                                <input
                                    {...register('position', { valueAsNumber: true })}
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        {...register('is_active')}
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Save size={18} />
                                <span>Save</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X size={18} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Content List */}
            <div className="space-y-4">
                {content.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-start justify-between"
                    >
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    {item.content_type}
                                </span>
                                <span className="font-medium text-gray-900">{item.key}</span>
                                {!item.is_active && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm">{item.value}</p>
                            {item.media_url && (
                                <p className="text-gray-400 text-xs mt-1">Media: {item.media_url}</p>
                            )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                            <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

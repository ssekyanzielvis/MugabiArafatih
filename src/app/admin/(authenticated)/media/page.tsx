'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Upload, Image as ImageIcon, Video, File, Download } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'

interface MediaFile {
    name: string
    id: string
    created_at: string
    metadata?: {
        size?: number
        mimetype?: string
    }
}

export default function MediaLibraryPage() {
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [storageStats, setStorageStats] = useState({ totalFiles: 0, totalSize: 0 })

    const supabase = createClient()

    useEffect(() => {
        fetchFiles()
    }, [])

    async function fetchFiles() {
        setLoading(true)
        try {
            const { data, error } = await supabase.storage.from('media').list()

            if (error) throw error

            const filesWithDetails: MediaFile[] = (data || []).map((file: any) => ({
                name: file.name,
                id: file.id,
                created_at: file.created_at || new Date().toISOString(),
                metadata: file.metadata as any
            }))

            setFiles(filesWithDetails)

            // Calculate storage stats
            const totalSize = filesWithDetails.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
            setStorageStats({
                totalFiles: filesWithDetails.length,
                totalSize: totalSize
            })
        } catch (error) {
            console.error('Error fetching files:', error)
            showToast('error', 'Failed to load media library')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(fileName: string) {
        if (!confirm(`Delete "${fileName}"? This action cannot be undone.`)) return

        try {
            const { error } = await supabase.storage.from('media').remove([fileName])

            if (error) throw error

            showToast('success', 'File deleted successfully')
            fetchFiles()
        } catch (error) {
            console.error('Error deleting file:', error)
            showToast('error', 'Failed to delete file')
        }
    }

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`

            const { error } = await supabase.storage.from('media').upload(fileName, file)

            if (error) throw error

            showToast('success', 'File uploaded successfully')
            fetchFiles()
        } catch (error) {
            console.error('Error uploading file:', error)
            showToast('error', 'Failed to upload file')
        } finally {
            setUploading(false)
            event.target.value = ''
        }
    }

    function getFileIcon(fileName: string) {
        const ext = fileName.split('.').pop()?.toLowerCase()
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
            return <ImageIcon size={24} />
        } else if (['mp4', 'webm', 'mov', 'avi'].includes(ext || '')) {
            return <Video size={24} />
        }
        return <File size={24} />
    }

    function formatBytes(bytes: number) {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="space-y-8 max-w-7xl">
            {/* Header */}
            <div className="pb-6 border-b-2" style={{ borderColor: 'var(--admin-border)' }}>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Media Library</h1>
                <p className="mt-2 font-medium opacity-70">Centralized file storage and management</p>
            </div>

            {/* Storage Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="admin-card p-6">
                    <p className="text-xs font-bold uppercase opacity-60 mb-2">Total Files</p>
                    <p className="text-3xl font-bold">{storageStats.totalFiles}</p>
                </div>
                <div className="admin-card p-6">
                    <p className="text-xs font-bold uppercase opacity-60 mb-2">Total Size</p>
                    <p className="text-3xl font-bold">{formatBytes(storageStats.totalSize)}</p>
                </div>
                <div className="admin-card p-6">
                    <p className="text-xs font-bold uppercase opacity-60 mb-2">Storage Used</p>
                    <p className="text-3xl font-bold">{((storageStats.totalSize / (100 * 1024 * 1024)) * 100).toFixed(1)}%</p>
                </div>
            </div>

            {/* Upload Section */}
            <div className="admin-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Upload Files</h2>
                </div>
                <label className="admin-button px-6 py-4 cursor-pointer inline-flex items-center gap-3">
                    <Upload size={20} />
                    <span>{uploading ? 'Uploading...' : 'Select File to Upload'}</span>
                    <input
                        type="file"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                        accept="image/*,video/*"
                    />
                </label>
                <p className="text-xs opacity-60 mt-3">Supported: Images (JPG, PNG, GIF, WebP, SVG) and Videos (MP4, WebM, MOV)</p>
            </div>

            {/* File Grid */}
            <div className="admin-card p-6">
                <h2 className="text-xl font-bold uppercase tracking-tight mb-6">All Files ({files.length})</h2>

                {loading ? (
                    <div className="text-center py-12 opacity-60">Loading files...</div>
                ) : files.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed opacity-40" style={{ borderColor: 'var(--admin-border)' }}>
                        <p className="font-bold uppercase tracking-wide text-sm">No files uploaded</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="border-2 p-4 flex flex-col"
                                style={{ borderColor: 'var(--admin-border)' }}
                            >
                                <div className="flex items-center justify-center h-32 mb-3 border" style={{ borderColor: 'var(--admin-border)' }}>
                                    {getFileIcon(file.name)}
                                </div>
                                <p className="font-bold text-sm truncate mb-2" title={file.name}>
                                    {file.name}
                                </p>
                                <p className="text-xs opacity-60 mb-1">
                                    {formatBytes(file.metadata?.size || 0)}
                                </p>
                                <p className="text-xs opacity-60 mb-4">
                                    {new Date(file.created_at).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2 mt-auto">
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${file.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 border-2 p-2 flex items-center justify-center transition-all hover:shadow-[2px_2px_0_var(--admin-border)]"
                                        style={{ borderColor: 'var(--admin-border)' }}
                                        title="View file"
                                    >
                                        <Download size={16} />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(file.name)}
                                        className="flex-1 border-2 p-2 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
                                        style={{ borderColor: 'var(--admin-border)' }}
                                        title="Delete file"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

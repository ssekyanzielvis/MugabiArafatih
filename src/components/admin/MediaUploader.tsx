'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon, Video } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'

interface MediaUploaderProps {
    section?: 'home' | 'kinsmen' | 'collaborate'
    onUploadComplete?: (url: string) => void
}

export default function MediaUploader({ section, onUploadComplete }: MediaUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const supabase = createClient()

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0])
        }
    }

    const handleUpload = async (file: File) => {
        setUploading(true)
        setUploadStatus('idle')
        setUploadProgress(0)

        try {
            // Validate section
            if (!section) {
                throw new Error('Section is required for upload')
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
            if (!validTypes.includes(file.type)) {
                throw new Error('Invalid file type. Please upload an image or video.')
            }

            // Validate file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                throw new Error('File size must be less than 50MB')
            }

            // Determine bucket name based on section
            const bucketName = `${section}-media`

            // Create unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90))
            }, 100)

            // Upload to Supabase Storage (section-specific bucket)
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file)

            clearInterval(progressInterval)

            if (error) throw error

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName)

            // Save to section-specific media table
            const mediaType = file.type.startsWith('image/') ? 'image' : 'video'
            const tableName = `${section}_media`
            
            const { error: dbError } = await supabase
                .from(tableName)
                .insert([{
                    media_url: publicUrl,
                    media_type: mediaType,
                    caption: file.name,
                    position: 0,
                    is_active: true
                }])

            if (dbError) {
                console.error('Error saving media to database:', {
                    message: dbError.message,
                    details: dbError.details,
                    hint: dbError.hint,
                    code: dbError.code
                })
                showToast('error', `Failed to save media: ${dbError.message || 'Unknown error'}`)
            } else {
                showToast('success', 'Media uploaded and saved successfully!')
            }

            setUploadProgress(100)
            setUploadStatus('success')

            if (onUploadComplete) {
                onUploadComplete(publicUrl)
            }

            setTimeout(() => {
                setUploadStatus('idle')
                setUploadProgress(0)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }, 3000)
        } catch (error: any) {
            console.error('Error uploading file:', error)
            setUploadStatus('error')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed p-12 text-center transition-all ${dragActive
                    ? 'border-inherit bg-inherit invert shadow-[0_0_0_4px_inset_currentColor]'
                    : 'border-inherit opacity-60 hover:opacity-100 bg-inherit'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleChange}
                    className="hidden"
                />

                <div className="space-y-6">
                    <div className="flex justify-center">
                        {uploading ? (
                            <div className="w-16 h-16 border-4 border-inherit border-t-transparent animate-spin"></div>
                        ) : (
                            <Upload className="w-20 h-20 opacity-40" />
                        )}
                    </div>

                    <div>
                        <p className="text-xl font-bold uppercase tracking-widest">
                            {uploading ? 'Processing Data...' : 'Drop Assets or click to Initialize'}
                        </p>
                        <p className="text-[10px] font-mono font-bold uppercase opacity-40 mt-2">
                            Valid Extensions: JPG / PNG / GIF / WEBP / MP4 / WEBM (MAX: 10MB)
                        </p>
                    </div>

                    {!uploading && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="admin-button px-10 py-3 text-xs font-bold uppercase tracking-widest"
                        >
                            Select File
                        </button>
                    )}

                    {uploading && uploadProgress > 0 && (
                        <div className="w-full max-w-xs mx-auto border border-inherit h-4 p-0.5 mt-6">
                            <div
                                className="bg-inherit invert h-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
                <div className="flex items-center space-x-3 text-inherit border-2 border-inherit bg-inherit invert p-4 font-bold uppercase tracking-widest text-xs">
                    <CheckCircle size={18} />
                    <span>Upload Sequence Successful</span>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="flex items-center space-x-3 text-red-500 border-2 border-red-500 p-4 font-bold uppercase tracking-widest text-xs">
                    <AlertCircle size={18} />
                    <span>Upload Sequence Failed / Interrupt detected</span>
                </div>
            )}
        </div>
    )
}

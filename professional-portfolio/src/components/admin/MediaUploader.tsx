'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon, Video } from 'lucide-react'

interface MediaUploaderProps {
    onUploadComplete?: (url: string) => void
}

export default function MediaUploader({ onUploadComplete }: MediaUploaderProps) {
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
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
            if (!validTypes.includes(file.type)) {
                throw new Error('Invalid file type. Please upload an image or video.')
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File size must be less than 10MB')
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `media/${fileName}`

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90))
            }, 100)

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('portfolio-media')
                .upload(filePath, file)

            clearInterval(progressInterval)

            if (error) throw error

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio-media')
                .getPublicUrl(filePath)

            setUploadProgress(100)
            setUploadStatus('success')

            if (onUploadComplete) {
                onUploadComplete(publicUrl)
            }

            setTimeout(() => {
                setUploadStatus('idle')
                setUploadProgress(0)
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
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleChange}
                    className="hidden"
                />

                <div className="space-y-4">
                    <div className="flex justify-center">
                        {uploading ? (
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Upload className="w-16 h-16 text-gray-400" />
                        )}
                    </div>

                    <div>
                        <p className="text-lg font-medium text-gray-700">
                            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Supports: JPG, PNG, GIF, WebP, MP4, WebM (max 10MB)
                        </p>
                    </div>

                    {!uploading && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Choose File
                        </button>
                    )}

                    {uploading && uploadProgress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-4">
                    <CheckCircle size={20} />
                    <span>File uploaded successfully!</span>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                    <AlertCircle size={20} />
                    <span>Failed to upload file. Please try again.</span>
                </div>
            )}
        </div>
    )
}

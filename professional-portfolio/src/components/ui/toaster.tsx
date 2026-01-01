'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
    id: string
    type: ToastType
    message: string
    duration?: number
}

let toastListeners: ((toast: Toast) => void)[] = []

export function showToast(type: ToastType, message: string, duration = 5000) {
    const toast: Toast = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        duration,
    }
    toastListeners.forEach(listener => listener(toast))
}

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        const listener = (toast: Toast) => {
            setToasts(prev => [...prev, toast])
            
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id))
            }, toast.duration || 5000)
        }

        toastListeners.push(listener)

        return () => {
            toastListeners = toastListeners.filter(l => l !== listener)
        }
    }, [])

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md">
            {toasts.map(toast => (
                <ToastComponent
                    key={toast.id}
                    toast={toast}
                    onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                />
            ))}
        </div>
    )
}

function ToastComponent({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    }

    const styles = {
        success: 'bg-black text-white border-white',
        error: 'bg-white text-black border-black',
        info: 'bg-black text-white border-white',
    }

    return (
        <div
            className={`flex items-start gap-3 p-4 border-2 shadow-lg animate-slideIn min-w-[300px] ${styles[toast.type]}`}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">
                {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
            </p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Close notification"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}

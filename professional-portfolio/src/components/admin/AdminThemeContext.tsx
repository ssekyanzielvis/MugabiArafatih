'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface AdminThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem('admin-theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('admin-theme', theme)
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    return (
        <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={mounted ? `admin-theme-${theme} min-h-screen` : 'min-h-screen'}>
                {children}
            </div>
        </AdminThemeContext.Provider>
    )
}

export function useAdminTheme() {
    const context = useContext(AdminThemeContext)
    if (context === undefined) {
        throw new Error('useAdminTheme must be used within an AdminThemeProvider')
    }
    return context
}

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type ColorMode = 'dark' | 'light'
type FontFamily = 'sans-serif' | 'serif' | 'monospace' | 'inter' | 'roboto' | 'poppins'

interface ThemeConfig {
    colorMode: ColorMode
    fontFamily: FontFamily
    primaryColor: string
    secondaryColor: string
}

interface ThemeContextType {
    config: ThemeConfig
    updateColorMode: (mode: ColorMode) => void
    updateFontFamily: (font: FontFamily) => void
    updatePrimaryColor: (color: string) => void
    updateSecondaryColor: (color: string) => void
    resetTheme: () => void
}

const defaultConfig: ThemeConfig = {
    colorMode: 'dark',
    fontFamily: 'sans-serif',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<ThemeConfig>(defaultConfig)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Load saved theme configuration from localStorage
        const savedConfig = localStorage.getItem('theme-config')
        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig))
            } catch (error) {
                console.error('Error loading theme config:', error)
            }
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            // Save theme configuration to localStorage
            localStorage.setItem('theme-config', JSON.stringify(config))
            
            // Apply CSS variables
            document.documentElement.style.setProperty(
                '--theme-bg',
                config.colorMode === 'dark' ? '#000000' : '#ffffff'
            )
            document.documentElement.style.setProperty(
                '--theme-fg',
                config.colorMode === 'dark' ? '#ffffff' : '#000000'
            )
            document.documentElement.style.setProperty(
                '--theme-primary',
                config.primaryColor
            )
            document.documentElement.style.setProperty(
                '--theme-secondary',
                config.secondaryColor
            )
            
            // Apply font family
            const fontMap: Record<FontFamily, string> = {
                'sans-serif': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                'serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
                'monospace': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                'inter': '"Inter", sans-serif',
                'roboto': '"Roboto", sans-serif',
                'poppins': '"Poppins", sans-serif',
            }
            
            document.documentElement.style.setProperty(
                '--theme-font',
                fontMap[config.fontFamily]
            )
        }
    }, [config, mounted])

    const updateColorMode = (mode: ColorMode) => {
        setConfig(prev => ({ ...prev, colorMode: mode }))
    }

    const updateFontFamily = (font: FontFamily) => {
        setConfig(prev => ({ ...prev, fontFamily: font }))
    }

    const updatePrimaryColor = (color: string) => {
        setConfig(prev => ({ ...prev, primaryColor: color }))
    }

    const updateSecondaryColor = (color: string) => {
        setConfig(prev => ({ ...prev, secondaryColor: color }))
    }

    const resetTheme = () => {
        setConfig(defaultConfig)
    }

    if (!mounted) {
        return null
    }

    return (
        <ThemeContext.Provider
            value={{
                config,
                updateColorMode,
                updateFontFamily,
                updatePrimaryColor,
                updateSecondaryColor,
                resetTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

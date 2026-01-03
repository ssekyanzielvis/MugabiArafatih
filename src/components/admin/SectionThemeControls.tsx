'use client'

import { useState, useEffect } from 'react'
import { Sliders, Save, Check, RefreshCw } from 'lucide-react'
import { showToast } from '@/components/ui/toaster'

type SectionName = 'header' | 'home' | 'kinsmen' | 'collaborate' | 'social_links' | 'footer'

interface SectionTheme {
    contrast: number
    saturation: number
    brightness: number
}

interface SectionThemeControlsProps {
    section: SectionName
    sectionLabel: string
    themeMode: 'dark' | 'light'
    initialTheme?: SectionTheme
    onSave?: () => void
}

const defaultTheme: SectionTheme = {
    contrast: 1,
    saturation: 1,
    brightness: 1,
}

export default function SectionThemeControls({
    section,
    sectionLabel,
    themeMode,
    initialTheme = defaultTheme,
    onSave,
}: SectionThemeControlsProps) {
    const [theme, setTheme] = useState<SectionTheme>(initialTheme)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setTheme(initialTheme)
    }, [initialTheme])

    const handleChange = (property: keyof SectionTheme, value: number) => {
        setTheme(prev => ({ ...prev, [property]: value }))
        setSaved(false)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/section-themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section,
                    theme_mode: themeMode,
                    ...theme,
                }),
            })

            if (!response.ok) throw new Error('Failed to save settings')

            setSaved(true)
            showToast('success', `${sectionLabel} theme saved successfully!`)
            
            if (onSave) onSave()
            
            setTimeout(() => setSaved(false), 2000)
        } catch (error) {
            console.error('Error saving theme:', error)
            showToast('error', 'Failed to save theme settings')
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        setTheme(defaultTheme)
        setSaved(false)
    }

    const getPreviewStyle = (): React.CSSProperties => ({
        filter: `contrast(${theme.contrast}) saturate(${theme.saturation}) brightness(${theme.brightness})`,
        backgroundColor: themeMode === 'dark' ? '#000000' : '#ffffff',
        color: themeMode === 'dark' ? '#ffffff' : '#000000',
        borderColor: themeMode === 'dark' ? '#ffffff' : '#000000',
    })

    return (
        <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Sliders size={20} />
                    <h3 className="text-lg font-bold uppercase">{sectionLabel}</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="admin-button text-sm px-3 py-1.5"
                        title="Reset to defaults"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="admin-button text-sm px-4 py-1.5 flex items-center gap-2"
                    >
                        {saved ? (
                            <>
                                <Check size={16} />
                                <span>Saved</span>
                            </>
                        ) : saving ? (
                            <span>Saving...</span>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Contrast Control */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">
                            Contrast
                        </label>
                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {theme.contrast.toFixed(2)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={theme.contrast}
                        onChange={(e) => handleChange('contrast', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                    />
                    <div className="flex justify-between text-xs opacity-60">
                        <span>Low (0.5)</span>
                        <span>Normal (1.0)</span>
                        <span>High (2.0)</span>
                    </div>
                </div>

                {/* Saturation Control */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">
                            Saturation
                        </label>
                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {theme.saturation.toFixed(2)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.05"
                        value={theme.saturation}
                        onChange={(e) => handleChange('saturation', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                    />
                    <div className="flex justify-between text-xs opacity-60">
                        <span>Grayscale (0.0)</span>
                        <span>Normal (1.0)</span>
                        <span>Vibrant (2.0)</span>
                    </div>
                </div>

                {/* Brightness Control */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">
                            Brightness
                        </label>
                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {theme.brightness.toFixed(2)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={theme.brightness}
                        onChange={(e) => handleChange('brightness', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                    />
                    <div className="flex justify-between text-xs opacity-60">
                        <span>Dark (0.5)</span>
                        <span>Normal (1.0)</span>
                        <span>Bright (1.5)</span>
                    </div>
                </div>

                {/* Preview */}
                <div className="mt-6">
                    <label className="text-sm font-semibold mb-2 block">Preview</label>
                    <div
                        className="p-6 border-2 transition-all duration-200"
                        style={getPreviewStyle()}
                    >
                        <h4 className="text-xl font-bold mb-2">{sectionLabel} Preview</h4>
                        <p className="text-sm mb-3">
                            This is how the {sectionLabel.toLowerCase()} section will appear with your current settings.
                        </p>
                        <button
                            className="px-4 py-2 border-2 font-semibold"
                            style={{
                                backgroundColor: themeMode === 'dark' ? '#ffffff' : '#000000',
                                color: themeMode === 'dark' ? '#000000' : '#ffffff',
                                borderColor: themeMode === 'dark' ? '#ffffff' : '#000000',
                            }}
                        >
                            Sample Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

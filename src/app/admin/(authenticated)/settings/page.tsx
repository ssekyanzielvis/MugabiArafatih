'use client'

import { useState, useEffect } from 'react'
import { Palette, Type, Moon, Sun, RotateCcw, Save, Check, Sliders } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { showToast } from '@/components/ui/toaster'
import SectionThemeControls from '@/components/admin/SectionThemeControls'

export default function SettingsPage() {
    const { config, updateColorMode, updateFontFamily, resetTheme, loadSectionThemes } = useTheme()
    const [saved, setSaved] = useState(false)
    const [sectionThemes, setSectionThemes] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'general' | 'sections'>('general')

    useEffect(() => {
        loadSectionThemesData()
    }, [config.colorMode])

    const loadSectionThemesData = async () => {
        try {
            const response = await fetch('/api/section-themes')
            if (response.ok) {
                const data = await response.json()
                setSectionThemes(data)
            }
        } catch (error) {
            console.error('Error loading section themes:', error)
        }
    }

    const fontOptions = [
        { value: 'sans-serif', label: 'Sans Serif (Default)', description: 'Clean and modern' },
        { value: 'serif', label: 'Serif', description: 'Traditional and elegant' },
        { value: 'monospace', label: 'Monospace', description: 'Code-like appearance' },
        { value: 'inter', label: 'Inter', description: 'Modern geometric sans-serif' },
        { value: 'roboto', label: 'Roboto', description: 'Google\'s popular font' },
        { value: 'poppins', label: 'Poppins', description: 'Geometric and friendly' },
    ]

    const handleSave = () => {
        setSaved(true)
        showToast('success', 'Settings saved successfully!')
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        resetTheme()
        showToast('info', 'Settings reset to defaults')
    }

    const handleSectionThemeSaved = () => {
        loadSectionThemes()
        loadSectionThemesData()
    }

    const getSectionTheme = (section: string) => {
        const found = sectionThemes.find(
            t => t.section === section && t.theme_mode === config.colorMode
        )
        return found ? {
            contrast: parseFloat(found.contrast) || 1,
            saturation: parseFloat(found.saturation) || 1,
            brightness: parseFloat(found.brightness) || 1,
        } : { contrast: 1, saturation: 1, brightness: 1 }
    }

    const sections = [
        { id: 'header', label: 'Header' },
        { id: 'home', label: 'Home Section' },
        { id: 'kinsmen', label: 'Kinsmen Section' },
        { id: 'collaborate', label: 'Collaborate Section' },
        { id: 'social_links', label: 'Social Links' },
        { id: 'footer', label: 'Footer' },
    ]

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                        Theme Settings
                    </h1>
                    <p className="mt-2 font-medium opacity-70">
                        Customize the appearance of your portfolio
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="admin-button flex items-center gap-2 text-sm"
                        title="Reset to default settings"
                    >
                        <RotateCcw size={18} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                    
                    <button
                        onClick={handleSave}
                        className="admin-button flex items-center gap-2"
                    >
                        {saved ? (
                            <>
                                <Check size={20} />
                                <span>Saved!</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b-2 border-inherit">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 font-bold transition-all ${
                        activeTab === 'general'
                            ? 'border-b-4 border-inherit -mb-0.5'
                            : 'opacity-50 hover:opacity-75'
                    }`}
                >
                    General Settings
                </button>
                <button
                    onClick={() => setActiveTab('sections')}
                    className={`px-6 py-3 font-bold flex items-center gap-2 transition-all ${
                        activeTab === 'sections'
                            ? 'border-b-4 border-inherit -mb-0.5'
                            : 'opacity-50 hover:opacity-75'
                    }`}
                >
                    <Sliders size={18} />
                    Section Themes
                </button>
            </div>

            {/* General Settings Tab */}
            {activeTab === 'general' && (
                <div className="space-y-8">{/* Color Mode Settings */}
            <div className="admin-card p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 border-2 border-inherit flex items-center justify-center">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                            Color Mode
                        </h2>
                        <p className="text-sm opacity-70 mt-1">
                            Choose between light and dark modes
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {/* Dark Mode */}
                    <button
                        onClick={() => updateColorMode('dark')}
                        className={`p-6 border-2 transition-all duration-200 ${
                            config.colorMode === 'dark'
                                ? 'border-inherit shadow-[4px_4px_0_var(--admin-border)]'
                                : 'border-gray-300 opacity-50 hover:opacity-75'
                        }`}
                        aria-pressed={config.colorMode === 'dark'}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-black border-2 border-white flex items-center justify-center">
                                <Moon size={28} className="text-white" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-1">Dark Mode</h3>
                                <p className="text-sm opacity-70">
                                    Black background, white text
                                </p>
                            </div>
                            {config.colorMode === 'dark' && (
                                <div className="w-6 h-6 border-2 border-inherit flex items-center justify-center">
                                    <Check size={16} />
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Light Mode */}
                    <button
                        onClick={() => updateColorMode('light')}
                        className={`p-6 border-2 transition-all duration-200 ${
                            config.colorMode === 'light'
                                ? 'border-inherit shadow-[4px_4px_0_var(--admin-border)]'
                                : 'border-gray-300 opacity-50 hover:opacity-75'
                        }`}
                        aria-pressed={config.colorMode === 'light'}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center">
                                <Sun size={28} className="text-black" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-1">Light Mode</h3>
                                <p className="text-sm opacity-70">
                                    White background, black text
                                </p>
                            </div>
                            {config.colorMode === 'light' && (
                                <div className="w-6 h-6 border-2 border-inherit flex items-center justify-center">
                                    <Check size={16} />
                                </div>
                            )}
                        </div>
                    </button>
                </div>

                <div className="mt-6 p-4 border-2 border-inherit">
                    <p className="text-sm font-medium">
                        <strong>Note:</strong> The color mode ensures proper contrast - 
                        background and text colors are always opposite (black/white) for optimal readability.
                    </p>
                </div>
            </div>

            {/* Typography Settings */}
            <div className="admin-card p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 border-2 border-inherit flex items-center justify-center">
                        <Type size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                            Typography
                        </h2>
                        <p className="text-sm opacity-70 mt-1">
                            Select the font family for your site
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fontOptions.map((font) => (
                        <button
                            key={font.value}
                            onClick={() => updateFontFamily(font.value as any)}
                            className={`p-5 border-2 transition-all duration-200 text-left ${
                                config.fontFamily === font.value
                                    ? 'border-inherit shadow-[4px_4px_0_var(--admin-border)]'
                                    : 'border-gray-300 opacity-50 hover:opacity-75'
                            }`}
                            aria-pressed={config.fontFamily === font.value}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-base">{font.label}</h3>
                                {config.fontFamily === font.value && (
                                    <Check size={18} />
                                )}
                            </div>
                            <p className="text-sm opacity-70 mb-3">
                                {font.description}
                            </p>
                            <p className="text-lg font-semibold" style={{ 
                                fontFamily: font.value.includes('-') 
                                    ? `"${font.value.charAt(0).toUpperCase() + font.value.slice(1)}", sans-serif`
                                    : font.value 
                            }}>
                                Sample Text
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview Section */}
            <div className="admin-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide mb-6">
                    Live Preview
                </h2>
                
                <div 
                    className="p-8 border-2 space-y-4"
                    style={{
                        backgroundColor: config.colorMode === 'dark' ? '#000000' : '#ffffff',
                        color: config.colorMode === 'dark' ? '#ffffff' : '#000000',
                        borderColor: config.colorMode === 'dark' ? '#ffffff' : '#000000',
                    }}
                >
                    <h3 className="text-2xl font-bold">Heading Example</h3>
                    <p className="text-base leading-relaxed">
                        This is how your text will appear with the current settings. 
                        The quick brown fox jumps over the lazy dog. 
                        Typography matters for readability and user experience.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            className="px-6 py-3 border-2 font-semibold transition-all hover:shadow-[4px_4px_0]"
                            style={{
                                backgroundColor: config.colorMode === 'dark' ? '#ffffff' : '#000000',
                                color: config.colorMode === 'dark' ? '#000000' : '#ffffff',
                                borderColor: config.colorMode === 'dark' ? '#ffffff' : '#000000',
                            }}
                        >
                            Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
            )}

            {/* Section Themes Tab */}
            {activeTab === 'sections' && (
                <div className="space-y-6">
                    <div className="admin-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Sliders size={24} />
                            <div>
                                <h2 className="text-xl font-bold uppercase">Section-Specific Themes</h2>
                                <p className="text-sm opacity-70 mt-1">
                                    Adjust contrast, saturation, and brightness for each section independently
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-2 border-inherit bg-gray-50 dark:bg-gray-900 mt-4">
                            <p className="text-sm">
                                <strong>Current Theme Mode:</strong> {config.colorMode === 'dark' ? 'Dark' : 'Light'}
                            </p>
                            <p className="text-xs opacity-70 mt-2">
                                Settings are saved separately for dark and light modes. 
                                Switch the theme mode in General Settings to configure the other mode.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {sections.map(section => (
                            <SectionThemeControls
                                key={`${section.id}-${config.colorMode}`}
                                section={section.id as any}
                                sectionLabel={section.label}
                                themeMode={config.colorMode}
                                initialTheme={getSectionTheme(section.id)}
                                onSave={handleSectionThemeSaved}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import { useTheme } from '@/contexts/ThemeContext'

type SectionName = 'header' | 'home' | 'kinsmen' | 'collaborate' | 'social_links' | 'footer'

interface SectionWrapperProps {
    section: SectionName
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export default function SectionWrapper({ section, children, className = '', style = {} }: SectionWrapperProps) {
    const { getSectionStyle } = useTheme()
    const sectionStyle = getSectionStyle(section)

    return (
        <div
            className={className}
            style={{
                ...sectionStyle,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import SectionWrapper from '@/components/visitor/SectionWrapper'
import { renderSocialIcon, formatSocialHref, getPlatformDisplayLabel } from '@/lib/socialPlatforms'

interface SocialLink {
    id: string
    platform: string
    url: string
    position: number
}

interface SocialLinksProps {
    align?: 'start' | 'center' | 'end'
    className?: string
}

export default function SocialLinks({ align = 'start', className = '' }: SocialLinksProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSocialLinks() {
            try {
                const response = await fetch('/api/social-links')
                if (response.ok) {
                    const data = await response.json()
                    setSocialLinks(data)
                }
            } catch (error) {
                console.error('Error fetching social links:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSocialLinks()
    }, [])

    if (loading) {
        return <div className="text-center p-8"><p className="text-sm opacity-50">Loading...</p></div>
    }

    if (!socialLinks || socialLinks.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed opacity-50">
                <p className="text-sm font-medium">No social links available</p>
            </div>
        )
    }

    return (
        <SectionWrapper section="social_links">
            <div className={`flex flex-wrap ${align === 'center' ? 'justify-center' : align === 'end' ? 'justify-end' : 'justify-start'} items-center gap-4 md:gap-6 lg:gap-8 my-8 md:my-12 lg:my-[1.5cm] ${className}`}>
                {socialLinks.map((link) => {
                    const isEmail = link.platform?.toLowerCase() === 'email' || link.platform?.toLowerCase() === 'mail'
                    const href = formatSocialHref(link.platform, link.url)
                    const label = getPlatformDisplayLabel(link.platform)

                    return (
                        <a
                            key={link.id}
                            href={href}
                            target={isEmail ? undefined : '_blank'}
                            rel={isEmail ? undefined : 'noopener noreferrer'}
                            className="p-3 md:p-4 lg:p-5 border-2 transition-all duration-200 hover:shadow-[4px_4px_0_var(--theme-fg)] hover:translate-x-[-2px] hover:translate-y-[-2px] group focus:outline-none focus-visible:ring-2"
                            style={{ borderColor: 'var(--theme-fg)' }}
                            aria-label={`${label}: ${link.url}`}
                            title={label}
                        >
                            <div 
                                className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                            >
                                {renderSocialIcon(link.platform, 'w-full h-full')}
                            </div>
                        </a>
                    )
                })}
            </div>
        </SectionWrapper>
    )
}

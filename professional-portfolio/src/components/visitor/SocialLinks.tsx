import { createClient } from '@/lib/supabase/server'
import { Mail, Facebook, Twitter, Youtube, ExternalLink } from 'lucide-react'

const iconMap: Record<string, any> = {
    email: Mail,
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
    tiktok: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    ),
}

export default async function SocialLinks() {
    const supabase = await createClient()

    const { data: socialLinks } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

    if (!socialLinks || socialLinks.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed opacity-50">
                <p className="text-sm font-medium">No social links available</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialLinks.map((link) => {
                    const Icon = iconMap[link.platform] || Mail
                    const isEmail = link.platform === 'email'
                    const href = isEmail ? `mailto:${link.url}` : link.url || '#'
                    const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

                    return (
                        <a
                            key={link.id}
                            href={href}
                            target={isEmail ? undefined : '_blank'}
                            rel={isEmail ? undefined : 'noopener noreferrer'}
                            className="flex items-center gap-3 p-4 border-2 transition-all duration-200 hover:shadow-[4px_4px_0_var(--theme-fg)] hover:translate-x-[-2px] hover:translate-y-[-2px] group focus:outline-none focus-visible:ring-2"
                            style={{ borderColor: 'var(--theme-fg)' }}
                            aria-label={`${label}: ${link.url}`}
                        >
                            <div 
                                className="w-12 h-12 border-2 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                                style={{ borderColor: 'var(--theme-fg)' }}
                            >
                                {typeof Icon === 'function' ? <Icon /> : <Icon size={22} aria-hidden="true" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm uppercase tracking-wide mb-1">
                                    {label}
                                </p>
                                <p className="text-sm truncate opacity-70">{link.url}</p>
                            </div>
                            {!isEmail && (
                                <ExternalLink size={18} className="flex-shrink-0 opacity-50" aria-hidden="true" />
                            )}
                        </a>
                    )
                })}
            </div>
    )
}

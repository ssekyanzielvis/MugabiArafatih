import { createClient } from '@/lib/supabase/server'
import { Mail, Facebook, Twitter, Youtube } from 'lucide-react'

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
        .from('website_content')
        .select('*')
        .eq('section', 'collaborate')
        .eq('content_type', 'social')
        .eq('is_active', true)
        .order('position', { ascending: true })

    if (!socialLinks || socialLinks.length === 0) {
        return null
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Connect With Me</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.map((link) => {
                    const Icon = iconMap[link.key] || Mail
                    const isEmail = link.key === 'email'
                    const href = isEmail ? `mailto:${link.value}` : link.value || '#'
                    const label = link.key.charAt(0).toUpperCase() + link.key.slice(1)

                    return (
                        <a
                            key={link.id}
                            href={href}
                            target={isEmail ? undefined : '_blank'}
                            rel={isEmail ? undefined : 'noopener noreferrer'}
                            className="flex items-center space-x-3 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300 group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {typeof Icon === 'function' ? <Icon /> : <Icon size={20} className="text-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                    {label}
                                </p>
                                <p className="text-sm text-gray-400 truncate">{link.value}</p>
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

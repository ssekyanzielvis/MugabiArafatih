import React from 'react'
import {
    Mail,
    Facebook,
    Youtube,
    Instagram,
    Linkedin,
    Github,
    Globe,
    Link2,
    Twitch,
} from 'lucide-react'

export interface PlatformConfig {
    value: string
    label: string
    placeholder: string
    prefix?: string
}

export const KNOWN_PLATFORMS: PlatformConfig[] = [
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
    { value: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourprofile' },
    { value: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/yourprofile' },
    { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
    { value: 'github', label: 'GitHub', placeholder: 'https://github.com/yourprofile' },
    { value: 'whatsapp', label: 'WhatsApp', placeholder: '+1234567890 or https://wa.me/1234567890' },
    { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/yourusername' },
    { value: 'discord', label: 'Discord', placeholder: 'https://discord.gg/yourinvite' },
    { value: 'twitch', label: 'Twitch', placeholder: 'https://twitch.tv/yourchannel' },
    { value: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
    { value: 'threads', label: 'Threads', placeholder: 'https://threads.net/@yourprofile' },
    { value: 'reddit', label: 'Reddit', placeholder: 'https://reddit.com/user/yourprofile' },
    { value: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/yourprofile' },
    { value: 'email', label: 'Email', placeholder: 'yourname@example.com' },
    { value: 'website', label: 'Website / Portfolio', placeholder: 'https://yourwebsite.com' },
    { value: 'custom', label: 'Custom / Other', placeholder: 'https://yourlink.com' },
]

export function renderSocialIcon(platform: string, className = 'w-6 h-6') {
    const key = (platform || '').toLowerCase().trim()

    switch (key) {
        case 'instagram':
            return <Instagram className={className} />
        case 'facebook':
            return <Facebook className={className} />
        case 'twitter':
        case 'x':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        case 'youtube':
            return <Youtube className={className} />
        case 'tiktok':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            )
        case 'linkedin':
            return <Linkedin className={className} />
        case 'github':
            return <Github className={className} />
        case 'whatsapp':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.45-.59 1.66-1.17.2-.57.2-1.07.14-1.17-.06-.11-.23-.17-.48-.3s-1.45-.72-1.68-.8-.39-.12-.56.12-.66.82-.81.99c-.15.17-.3.19-.55.07-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.43.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48z" />
                </svg>
            )
        case 'telegram':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                </svg>
            )
        case 'discord':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
            )
        case 'twitch':
            return <Twitch className={className} />
        case 'spotify':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.745 3.808-.871 7.076-.505 9.722 1.112.294.18.386.563.207.857zm1.226-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.849-.106-.976-.519-.127-.414.106-.849.519-.976 3.632-1.102 8.147-.568 11.237 1.332.366.226.481.707.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.165-.623-.15-.493.129-1.016.623-1.165 3.532-1.072 9.404-.866 13.115 1.337.444.263.59.84.327 1.284-.264.444-.841.59-1.284.327z" />
                </svg>
            )
        case 'threads':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.095 5.467 0 12.186 0c6.643 0 11.96 5.253 12.012 11.814v.737h-3.41v-.737c0-4.839-3.856-8.773-8.602-8.773-4.747 0-8.603 3.934-8.603 8.773 0 4.84 3.856 8.774 8.603 8.774 2.923 0 5.568-1.48 7.075-3.957l2.88 1.83C18.28 21.996 15.347 24 12.186 24zm-1.015-7.391c-2.373 0-4.305-1.89-4.305-4.215s1.932-4.215 4.305-4.215c2.372 0 4.305 1.89 4.305 4.215s-1.933 4.215-4.305 4.215z" />
                </svg>
            )
        case 'reddit':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
            )
        case 'pinterest':
            return (
                <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                </svg>
            )
        case 'email':
        case 'mail':
            return <Mail className={className} />
        case 'website':
        case 'globe':
        case 'portfolio':
            return <Globe className={className} />
        default:
            return <Link2 className={className} />
    }
}

export function formatSocialHref(platform: string, url: string): string {
    const trimmed = (url || '').trim()
    const p = (platform || '').toLowerCase().trim()

    if (!trimmed) return '#'

    if (p === 'email' || p === 'mail') {
        return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`
    }

    if (p === 'whatsapp') {
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed
        }
        const cleaned = trimmed.replace(/[^0-9]/g, '')
        return `https://wa.me/${cleaned}`
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('mailto:') && !trimmed.startsWith('tel:')) {
        return `https://${trimmed}`
    }

    return trimmed
}

export function getPlatformDisplayLabel(platform: string): string {
    const known = KNOWN_PLATFORMS.find(p => p.value === platform.toLowerCase())
    if (known && known.value !== 'custom') return known.label
    return platform.charAt(0).toUpperCase() + platform.slice(1)
}

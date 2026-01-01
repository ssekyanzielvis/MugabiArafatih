import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

interface TwoColumnLayoutProps {
    section: 'home' | 'kinsmen' | 'collaborate'
}

export default async function TwoColumnLayout({ section }: TwoColumnLayoutProps) {
    const supabase = await createClient()

    // Fetch content from database
    const { data: content } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', section)
        .eq('is_active', true)
        .order('position', { ascending: true })

    // Separate text and media content
    const textContent = content?.filter(item => item.content_type === 'text') || []
    const mediaContent = content?.filter(item => item.content_type === 'media') || []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Left Column - Media */}
            <div className="space-y-8 order-2 lg:order-1">
                {mediaContent.length > 0 ? (
                    mediaContent.map((media, index) => (
                        <div 
                            key={media.id} 
                            className="visitor-card overflow-hidden group animate-fadeIn"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {media.media_type === 'image' ? (
                                <div className="relative h-[300px] md:h-[400px] lg:h-[450px] border-2" style={{ borderColor: 'var(--theme-fg)' }}>
                                    <Image
                                        src={media.media_url || '/placeholder.jpg'}
                                        alt={media.key}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority={index === 0}
                                    />
                                </div>
                            ) : (
                                <div className="relative pt-[56.25%] border-2" style={{ borderColor: 'var(--theme-fg)' }}>
                                    <video
                                        src={media.media_url}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                        controls
                                        poster="/video-poster.jpg"
                                        aria-label={media.key}
                                    />
                                </div>
                            )}
                            {media.value && (
                                <p className="mt-4 text-sm font-medium opacity-70 italic text-center">
                                    {media.value}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div 
                        className="relative h-[300px] md:h-[400px] border-2 flex items-center justify-center"
                        style={{ borderColor: 'var(--theme-fg)' }}
                    >
                        <p className="text-base font-medium opacity-50">No media available</p>
                    </div>
                )}
            </div>

            {/* Right Column - Text Content */}
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
                {textContent.map((item, index) => {
                    const animationDelay = `${index * 100}ms`

                    switch (item.key) {
                        case 'welcome':
                            return (
                                <div key={item.id}>
                                    <h1
                                        className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight animate-fadeIn leading-tight"
                                        style={{ animationDelay }}
                                    >
                                        {item.value}
                                    </h1>
                                    <div 
                                        className="w-24 h-1 mt-4"
                                        style={{ backgroundColor: 'var(--theme-fg)' }}
                                    />
                                </div>
                            )
                        case 'name':
                            return (
                                <h2
                                    key={item.id}
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight animate-fadeIn"
                                    style={{ animationDelay }}
                                >
                                    {item.value}
                                </h2>
                            )
                        case 'short_name':
                            return (
                                <h3
                                    key={item.id}
                                    className="text-xl md:text-2xl font-semibold uppercase tracking-wide opacity-80 animate-fadeIn"
                                    style={{ animationDelay }}
                                >
                                    {item.value}
                                </h3>
                            )
                        case 'description':
                        case 'definition':
                            return (
                                <p
                                    key={item.id}
                                    className="text-base md:text-lg lg:text-xl leading-relaxed font-medium opacity-90 animate-fadeIn"
                                    style={{ animationDelay }}
                                >
                                    {item.value}
                                </p>
                            )
                        case 'title':
                            return (
                                <div key={item.id} className="animate-fadeIn" style={{ animationDelay }}>
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight">
                                        {item.value}
                                    </h2>
                                    <div 
                                        className="w-20 h-1 mt-3"
                                        style={{ backgroundColor: 'var(--theme-fg)' }}
                                    />
                                </div>
                            )
                        default:
                            return (
                                <div 
                                    key={item.id} 
                                    className="visitor-card animate-fadeIn" 
                                    style={{ animationDelay }}
                                >
                                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide mb-3">
                                        {item.key.replace(/_/g, ' ')}
                                    </h3>
                                    <div 
                                        className="w-16 h-0.5 mb-4"
                                        style={{ backgroundColor: 'var(--theme-fg)' }}
                                    />
                                    <p className="text-base md:text-lg leading-relaxed font-medium opacity-90">
                                        {item.value}
                                    </p>
                                </div>
                            )
                    }
                })}
            </div>
        </div>
    )
}

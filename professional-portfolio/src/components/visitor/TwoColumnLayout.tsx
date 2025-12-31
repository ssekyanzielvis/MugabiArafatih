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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Media */}
            <div className="space-y-6 order-2 lg:order-1">
                {mediaContent.length > 0 ? (
                    mediaContent.map((media) => (
                        <div key={media.id} className="relative rounded-2xl overflow-hidden shadow-2xl group animate-fadeIn">
                            {media.media_type === 'image' ? (
                                <div className="relative h-[400px] bg-gray-800">
                                    <Image
                                        src={media.media_url || '/placeholder.jpg'}
                                        alt={media.key}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            ) : (
                                <div className="relative pt-[56.25%] bg-gray-800">
                                    <video
                                        src={media.media_url}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                        controls
                                        poster="/video-poster.jpg"
                                    />
                                </div>
                            )}
                            {media.value && (
                                <p className="mt-3 text-sm text-gray-400 italic">{media.value}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="relative h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                        <p className="text-gray-500">No media available</p>
                    </div>
                )}
            </div>

            {/* Right Column - Text Content */}
            <div className="space-y-6 order-1 lg:order-2">
                {textContent.map((item, index) => {
                    const animationDelay = `${index * 100}ms`

                    switch (item.key) {
                        case 'welcome':
                            return (
                                <h1
                                    key={item.id}
                                    className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text animate-fadeIn leading-tight"
                                    style={{ animationDelay }}
                                >
                                    {item.value}
                                </h1>
                            )
                        case 'name':
                            return (
                                <h2
                                    key={item.id}
                                    className="text-4xl md:text-5xl font-bold text-white animate-fadeIn"
                                    style={{ animationDelay }}
                                >
                                    {item.value}
                                </h2>
                            )
                        case 'short_name':
                            return (
                                <h3
                                    key={item.id}
                                    className="text-2xl md:text-3xl text-gray-300 font-medium animate-fadeIn"
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
                                    className="text-lg md:text-xl text-gray-300 leading-relaxed animate-fadeIn"
                                    style={{ animationDelay }}
                                >
                                    {item.value}
                                </p>
                            )
                        case 'title':
                            return (
                                <h2
                                    key={item.id}
                                    className="text-3xl md:text-4xl font-bold text-white animate-fadeIn"
                                    style={{ animationDelay }}
                                >
                                    {item.value}
                                </h2>
                            )
                        default:
                            return (
                                <div key={item.id} className="animate-fadeIn" style={{ animationDelay }}>
                                    <h3 className="text-2xl font-semibold mb-2 text-white capitalize">
                                        {item.key.replace(/_/g, ' ')}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{item.value}</p>
                                </div>
                            )
                    }
                })}
            </div>
        </div>
    )
}

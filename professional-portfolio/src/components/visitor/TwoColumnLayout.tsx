import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

interface TwoColumnLayoutProps {
    section: 'home' | 'kinsmen' | 'collaborate'
}

export default async function TwoColumnLayout({ section }: TwoColumnLayoutProps) {
    const supabase = await createClient()

    // Fetch content from new database structure
    const contentTable = `${section}_content`
    const mediaTable = `${section}_media`

    // Fetch text content
    const { data: textData, error: textError } = await supabase
        .from(contentTable)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (textError) {
        console.error(`Error fetching ${section} content:`, textError)
        
        // Check if it's a proper Supabase error with properties
        if (textError && 'message' in textError) {
            console.error('Error details:', {
                message: textError.message,
                details: textError.details,
                hint: textError.hint,
                code: textError.code
            })
        } else {
            console.error('Unexpected error format:', textError)
            console.error('This might indicate RLS policy blocking or table does not exist. Please run supabase-setup.sql script.')
        }
    } else if (textData === null) {
        // This is normal for maybeSingle() when no rows match
        console.warn(`No active content found in ${contentTable} table. Add content via admin dashboard or run supabase-setup.sql for sample data.`)
    }

    // Fetch media content
    const { data: mediaContent, error: mediaError } = await supabase
        .from(mediaTable)
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true })

    if (mediaError) {
        console.error(`Error fetching ${section} media:`, mediaError)
        
        // Check if it's a proper Supabase error with properties
        if (mediaError && 'message' in mediaError) {
            console.error('Error details:', {
                message: mediaError.message,
                details: mediaError.details,
                hint: mediaError.hint,
                code: mediaError.code
            })
        } else {
            console.error('Unexpected error format:', mediaError)
            console.error('This might indicate RLS policy blocking or table does not exist. Please run supabase-setup.sql script.')
        }
    } else if (!mediaContent || mediaContent.length === 0) {
        console.warn(`No active media found in ${mediaTable} table. Upload media via admin dashboard.`)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Left Column - Media */}
            <div className="space-y-8 order-2 lg:order-1">
                {mediaContent && mediaContent.length > 0 ? (
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
                                        alt={media.caption || `${section} image`}
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
                                        aria-label={media.caption || `${section} video`}
                                    />
                                </div>
                            )}
                            {media.caption && (
                                <p className="mt-4 text-sm font-medium opacity-70 italic text-center" style={{ color: 'var(--theme-fg)' }}>
                                    {media.caption}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div 
                        className="relative h-[300px] md:h-[400px] border-2 flex items-center justify-center"
                        style={{ borderColor: 'var(--theme-fg)' }}
                    >
                        <p className="text-base font-medium opacity-50" style={{ color: 'var(--theme-fg)' }}>No media available</p>
                    </div>
                )}
            </div>

            {/* Right Column - Text Content */}
            <div className="space-y-6 md:space-y-8 lg:space-y-12 order-1 lg:order-2">
                {section === 'home' && textData ? (
                    /* Home Section - Special Layout */
                    <div className="space-y-8 md:space-y-12 animate-fadeIn">
                        {/* Welcome Message */}
                        {textData.welcome_message && (
                            <div className="space-y-4">
                                <p className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide" style={{ color: 'var(--theme-fg)' }}>
                                    {textData.welcome_message}
                                </p>
                                <div 
                                    className="w-20 md:w-24 h-1"
                                    style={{ backgroundColor: 'var(--theme-fg)' }}
                                />
                            </div>
                        )}

                        {/* Full Name and Short Name */}
                        <div className="space-y-6">
                            {textData.short_name && (
                                <div 
                                    className="w-20 h-20 md:w-24 md:h-24 border-4 flex items-center justify-center"
                                    style={{ borderColor: 'var(--theme-fg)' }}
                                >
                                    <span className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--theme-fg)' }}>
                                        {textData.short_name}
                                    </span>
                                </div>
                            )}

                            {textData.full_name && (
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-tight" style={{ color: 'var(--theme-fg)' }}>
                                    {textData.full_name}
                                </h1>
                            )}
                        </div>

                        {/* Professional Description */}
                        {textData.description && (
                            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium opacity-90" style={{ color: 'var(--theme-fg)' }}>
                                {textData.description}
                            </p>
                        )}
                    </div>
                ) : section === 'kinsmen' && textData ? (
                    /* Kinsmen Section */
                    <div className="space-y-8 md:space-y-12 animate-fadeIn">
                        {textData.definition && (
                            <div className="space-y-4">
                                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide" style={{ color: 'var(--theme-fg)' }}>Definition</h2>
                                <p className="text-lg md:text-xl leading-relaxed opacity-90 italic" style={{ color: 'var(--theme-fg)' }}>
                                    {textData.definition}
                                </p>
                            </div>
                        )}

                        {textData.title && (
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight" style={{ color: 'var(--theme-fg)' }}>
                                    {textData.title}
                                </h1>
                                <div 
                                    className="w-24 h-1"
                                    style={{ backgroundColor: 'var(--theme-fg)' }}
                                />
                            </div>
                        )}

                        {textData.description && (
                            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium opacity-90" style={{ color: 'var(--theme-fg)' }}>
                                {textData.description}
                            </p>
                        )}
                    </div>
                ) : section === 'collaborate' && textData ? (
                    /* Collaborate Section */
                    <div className="space-y-8 md:space-y-12 animate-fadeIn">
                        {textData.title && (
                            <div className="space-y-4">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight" style={{ color: 'var(--theme-fg)' }}>
                                    {textData.title}
                                </h1>
                                <div 
                                    className="w-24 h-1"
                                    style={{ backgroundColor: 'var(--theme-fg)' }}
                                />
                            </div>
                        )}

                        {textData.description && (
                            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium opacity-90" style={{ color: 'var(--theme-fg)' }}>
                                {textData.description}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-base opacity-50" style={{ color: 'var(--theme-fg)' }}>No content available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

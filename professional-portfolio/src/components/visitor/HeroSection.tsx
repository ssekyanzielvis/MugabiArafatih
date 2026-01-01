import { createClient } from '@/lib/supabase/server'

export default async function HeroSection() {
    const supabase = await createClient()

    const { data: content } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'home')
        .eq('content_type', 'text')
        .eq('is_active', true)
        .order('position', { ascending: true })

    const welcome = content?.find(item => item.key === 'welcome')?.value || 'Welcome'
    const name = content?.find(item => item.key === 'name')?.value || 'Mugabi Arafatih'
    const shortName = content?.find(item => item.key === 'short_name')?.value || 'MA'
    const description = content?.find(item => item.key === 'description')?.value || 'Building exceptional digital experiences with precision and passion.'

    return (
        <section className="py-12 md:py-16 lg:py-24">
            <div className="text-center space-y-8 md:space-y-12 animate-fadeIn">
                {/* Welcome Text */}
                <div className="space-y-4">
                    <p className="text-lg md:text-xl font-bold uppercase tracking-widest opacity-70">
                        {welcome}
                    </p>
                    <div 
                        className="w-16 h-1 mx-auto"
                        style={{ backgroundColor: 'var(--theme-fg)' }}
                    />
                </div>

                {/* Name and Avatar */}
                <div className="flex flex-col items-center gap-6">
                    <div 
                        className="w-24 h-24 md:w-32 md:h-32 border-4 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
                        style={{ borderColor: 'var(--theme-fg)' }}
                    >
                        <span className="text-3xl md:text-4xl font-bold">{shortName}</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight">
                        {name}
                    </h1>
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed font-medium opacity-90 px-4">
                    {description}
                </p>

                {/* Decorative Lines */}
                <div className="flex justify-center gap-4 pt-4">
                    <div 
                        className="w-20 md:w-32 h-1"
                        style={{ backgroundColor: 'var(--theme-fg)' }}
                    />
                    <div 
                        className="w-20 md:w-32 h-1 opacity-50"
                        style={{ backgroundColor: 'var(--theme-fg)' }}
                    />
                </div>
            </div>
        </section>
    )
}

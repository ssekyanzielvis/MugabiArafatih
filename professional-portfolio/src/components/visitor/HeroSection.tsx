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
    const name = content?.find(item => item.key === 'name')?.value || 'Your Name'
    const shortName = content?.find(item => item.key === 'short_name')?.value || 'YN'
    const description = content?.find(item => item.key === 'description')?.value || 'Professional description'

    return (
        <section className="py-12 md:py-20">
            <div className="text-center space-y-6 animate-fadeIn">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold gradient-text">
                    {welcome}
                </h1>

                <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-white font-bold text-2xl md:text-3xl">{shortName}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                        {name}
                    </h2>
                </div>

                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    {description}
                </p>

                <div className="flex justify-center space-x-4 pt-6">
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
                </div>
            </div>
        </section>
    )
}

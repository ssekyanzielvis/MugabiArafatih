import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'

export default function KinsmenPage() {
    return (
        <div className="space-y-12 md:space-y-16">
            <div className="text-center space-y-6 animate-fadeIn">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight">
                    Kinsmen
                </h1>
                <div 
                    className="w-24 md:w-32 h-1 mx-auto"
                    style={{ backgroundColor: 'var(--theme-fg)' }}
                />
            </div>

            <TwoColumnLayout section="kinsmen" />
        </div>
    )
}

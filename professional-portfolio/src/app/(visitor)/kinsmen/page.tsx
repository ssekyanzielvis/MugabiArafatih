import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'

export default function KinsmenPage() {
    return (
        <div className="space-y-12 py-8">
            <div className="text-center space-y-4 animate-fadeIn">
                <h1 className="text-5xl md:text-6xl font-bold gradient-text">
                    Kinsmen
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <TwoColumnLayout section="kinsmen" />
        </div>
    )
}

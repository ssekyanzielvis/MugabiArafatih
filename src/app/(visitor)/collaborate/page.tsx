import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'

export default function CollaboratePage() {
    return (
        <div className="w-full flex-1 flex flex-col justify-center items-center py-4">
            <div className="w-full animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <TwoColumnLayout section="collaborate" />
            </div>
        </div>
    )
}

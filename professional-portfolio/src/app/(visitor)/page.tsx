import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'
import HeroSection from '@/components/visitor/HeroSection'

export default function HomePage() {
    return (
        <div className="space-y-16 md:space-y-24">
            <HeroSection />

            <section className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <TwoColumnLayout section="home" />
            </section>
        </div>
    )
}

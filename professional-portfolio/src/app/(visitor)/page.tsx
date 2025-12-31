import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'
import HeroSection from '@/components/visitor/HeroSection'

export default function HomePage() {
    return (
        <div className="space-y-16">
            <HeroSection />

            <section className="pt-8">
                <TwoColumnLayout section="home" />
            </section>
        </div>
    )
}

import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'
import ContactForm from '@/components/visitor/ContactForm'
import SocialLinks from '@/components/visitor/SocialLinks'

export default function CollaboratePage() {
    return (
        <div className="space-y-16 md:space-y-24">
            {/* Header Section */}
            <div className="text-center space-y-6 animate-fadeIn">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight">
                    Let's Collaborate
                </h1>
                <div 
                    className="w-24 md:w-32 h-1 mx-auto"
                    style={{ backgroundColor: 'var(--theme-fg)' }}
                />
                <p className="text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-80">
                    Ready to bring your ideas to life? Let's work together to create something amazing.
                </p>
            </div>

            {/* Content Section */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <TwoColumnLayout section="collaborate" />
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <div className="order-2 lg:order-1">
                    <SocialLinks />
                </div>
                <div className="order-1 lg:order-2">
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}

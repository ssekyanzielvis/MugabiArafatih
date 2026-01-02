import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'
import ContactForm from '@/components/visitor/ContactForm'
import SocialLinks from '@/components/visitor/SocialLinks'

export default function CollaboratePage() {
    return (
        <div className="space-y-16 md:space-y-24">
            {/* Header Section */}
            <div className="text-center space-y-6 animate-fadeIn max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    Let's collaborate
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-80">
                    Ready to bring your ideas to life? Let's work together to create something amazing.
                </p>
            </div>

            {/* Content Section */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <TwoColumnLayout section="collaborate" />
            </div>

            {/* Contact Channels - Full Width */}
            <div className="animate-fadeIn max-w-4xl mx-auto" style={{ animationDelay: '0.4s' }}>
                <SocialLinks />
            </div>

            {/* Contact Form - Full Width */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                <ContactForm />
            </div>
        </div>
    )
}

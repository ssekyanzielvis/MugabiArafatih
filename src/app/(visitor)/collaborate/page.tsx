import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'
import ContactForm from '@/components/visitor/ContactForm'
import SocialLinks from '@/components/visitor/SocialLinks'

export default function CollaboratePage() {
    return (
        <div className="space-y-12 md:space-y-16 my-8">
            {/* Content Section with Form in Right Column */}
            <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12" style={{ animationDelay: '0.2s' }}>
                <TwoColumnLayout section="collaborate" />
                <div className="order-1 lg:order-2">
                    <ContactForm />
                </div>
            </div>

            {/* Contact Channels - Full Width */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.6s', marginTop: '1.5cm', marginBottom: '1.5cm' }}>
                <SocialLinks />
            </div>
        </div>
    )
}

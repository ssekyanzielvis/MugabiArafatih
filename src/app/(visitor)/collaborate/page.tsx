import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'
import ContactForm from '@/components/visitor/ContactForm'
import SocialLinks from '@/components/visitor/SocialLinks'

export default function CollaboratePage() {
    return (
        <div className="space-y-12 md:space-y-16 my-8">
            {/* Content Section */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <TwoColumnLayout section="collaborate" />
            </div>

            {/* Contact Form - Full Width */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s', marginTop: '1.5cm' }}>
                <ContactForm />
            </div>

            {/* Contact Channels - Full Width */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.6s', marginTop: '1.5cm', marginBottom: '1.5cm' }}>
                <SocialLinks />
            </div>
        </div>
    )
}

import TwoColumnLayout from '@/components/visitor/TwoColumnLayout'
import ContactForm from '@/components/visitor/ContactForm'
import SocialLinks from '@/components/visitor/SocialLinks'

export default function CollaboratePage() {
    return (
        <div className="space-y-12 py-8">
            <div className="text-center space-y-4 animate-fadeIn">
                <h1 className="text-5xl md:text-6xl font-bold gradient-text">
                    Let's Collaborate
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <TwoColumnLayout section="collaborate" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                <div>
                    <SocialLinks />
                </div>
                <div>
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}

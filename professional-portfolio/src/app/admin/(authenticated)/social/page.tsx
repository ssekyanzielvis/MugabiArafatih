import SocialLinksManager from '@/components/admin/SocialLinksManager'

export default function SocialLinksPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Social Links</h1>
                <p className="opacity-60 text-sm">Manage your social media links and contact information</p>
            </div>

            <SocialLinksManager />
        </div>
    )
}

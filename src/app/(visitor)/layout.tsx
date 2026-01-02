import type { Metadata } from 'next'
import Header from '@/components/visitor/Header'
import AnalyticsTracker from '@/components/visitor/AnalyticsTracker'
import '../globals.css'

export const metadata: Metadata = {
    title: 'Professional Portfolio - Mugabi Arafatih',
    description: 'Showcasing expertise and collaboration opportunities',
}

export default function VisitorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="visitor-theme min-h-screen antialiased">
            <AnalyticsTracker />
            <Header />
            <main className="py-4 md:py-8 pb-8 md:pb-12 mx-4 sm:mx-8 md:mx-12 lg:mx-[2cm]">
                {children}
            </main>
        </div>
    )
}

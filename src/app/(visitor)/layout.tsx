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
            <main style={{ 
                marginLeft: '2cm', 
                marginRight: '2cm',
                paddingTop: '1rem',
                paddingBottom: '3rem'
            }}>
                {children}
            </main>
        </div>
    )
}

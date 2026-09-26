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
        <div className="visitor-theme min-h-screen flex flex-col antialiased w-full">
            <AnalyticsTracker />
            <Header />
            <main 
                className="flex-1 w-full flex flex-col justify-center items-center" 
                style={{ 
                    paddingLeft: '2cm', 
                    paddingRight: '2cm',
                    paddingTop: '1rem',
                    paddingBottom: '2rem'
                }}
            >
                <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center">
                    {children}
                </div>
            </main>
        </div>
    )
}

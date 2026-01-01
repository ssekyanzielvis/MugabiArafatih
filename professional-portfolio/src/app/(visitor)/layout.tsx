import type { Metadata } from 'next'
import Header from '@/components/visitor/Header'
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
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
                {children}
            </main>
            <footer className="border-t-2 mt-16 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm font-medium">
                            © {new Date().getFullYear()} Mugabi Arafatih. All rights reserved.
                        </p>
                        <p className="text-sm font-medium">
                            Built with Next.js & Supabase
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

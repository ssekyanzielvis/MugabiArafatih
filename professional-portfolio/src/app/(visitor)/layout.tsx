import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/visitor/Header'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

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
        <div className="dark bg-gray-900 text-white min-h-screen antialiased">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {children}
            </main>
        </div>
    )
}

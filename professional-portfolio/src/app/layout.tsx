import type { Metadata } from 'next'
import { Inter, Roboto, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap'
})

const roboto = Roboto({ 
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    variable: '--font-roboto',
    display: 'swap'
})

const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-poppins',
    display: 'swap'
})

export const metadata: Metadata = {
    title: 'Professional Portfolio - Mugabi Arafatih',
    description: 'Showcasing expertise and collaboration opportunities',
    keywords: ['portfolio', 'professional', 'developer', 'collaboration'],
    authors: [{ name: 'Mugabi Arafatih' }],
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${roboto.variable} ${poppins.variable}`}>
            <body style={{ fontFamily: 'var(--theme-font, sans-serif)' }}>
                <ThemeProvider>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}

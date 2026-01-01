'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Kinsmen', path: '/kinsmen' },
    { name: 'Collaborate', path: '/collaborate' },
]

export default function Header() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        // Close mobile menu on route change
        setIsMobileMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        // Prevent body scroll when mobile menu is open
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <header 
            className={`sticky top-0 z-50 transition-all duration-300 border-b-2 ${
                isScrolled 
                    ? 'shadow-[0_4px_0_var(--theme-fg)]' 
                    : ''
            }`}
            style={{
                backgroundColor: 'var(--theme-bg)',
                borderColor: 'var(--theme-fg)',
            }}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link 
                        href="/" 
                        className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{ color: 'var(--theme-fg)' }}
                    >
                        <div 
                            className="w-12 h-12 border-2 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
                            style={{ 
                                borderColor: 'var(--theme-fg)',
                                backgroundColor: 'var(--theme-bg)' 
                            }}
                        >
                            <span className="font-bold text-xl">MA</span>
                        </div>
                        <span className="text-xl font-bold hidden sm:block">
                            Portfolio
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-6 py-3 transition-all duration-200 font-semibold border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                                    pathname === item.path
                                        ? 'visitor-button'
                                        : ''
                                }`}
                                style={{
                                    backgroundColor: pathname === item.path ? 'var(--theme-fg)' : 'transparent',
                                    color: pathname === item.path ? 'var(--theme-bg)' : 'var(--theme-fg)',
                                    borderColor: 'var(--theme-fg)',
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 border-2 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                        style={{ 
                            borderColor: 'var(--theme-fg)',
                            color: 'var(--theme-fg)' 
                        }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div 
                        className="md:hidden mt-6 pt-6 pb-4 border-t-2 animate-fadeIn"
                        style={{ borderColor: 'var(--theme-fg)' }}
                    >
                        <div className="flex flex-col gap-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`px-6 py-4 transition-all duration-200 font-semibold border-2 text-center ${
                                        pathname === item.path
                                            ? 'visitor-button'
                                            : ''
                                    }`}
                                    style={{
                                        backgroundColor: pathname === item.path ? 'var(--theme-fg)' : 'transparent',
                                        color: pathname === item.path ? 'var(--theme-bg)' : 'var(--theme-fg)',
                                        borderColor: 'var(--theme-fg)',
                                    }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

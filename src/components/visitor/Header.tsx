'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
            className="sticky top-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: 'var(--theme-bg)',
                height: '2.5cm'
            }}
        >
            <nav className="h-full flex items-center" style={{ marginLeft: '96px', marginRight: '96px' }}>
                <div className="flex items-center justify-between w-full">
                    {/* Logo */}
                    <Link 
                        href="/" 
                        className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{ color: 'var(--theme-fg)' }}
                    >
                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/logo.png"
                                alt="Portfolio Logo"
                                width={112}
                                height={112}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-8 py-4 text-base transition-all duration-200 font-semibold focus:outline-none ${
                                    pathname === item.path
                                        ? 'visitor-button'
                                        : 'hover:opacity-80'
                                }`}
                                style={{
                                    backgroundColor: pathname === item.path ? 'var(--theme-fg)' : 'transparent',
                                    color: pathname === item.path ? 'var(--theme-bg)' : 'var(--theme-fg)',
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-4 transition-all hover:scale-110 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                        style={{ 
                            color: 'var(--theme-fg)' 
                        }}
                    >
                        {isMobileMenuOpen ? <X size={48} /> : <Menu size={48} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div 
                        className="md:hidden mt-6 pt-6 pb-4 animate-fadeIn"
                    >
                        <div className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`px-12 py-8 text-base transition-all duration-200 font-semibold text-center ${
                                        pathname === item.path
                                            ? 'visitor-button'
                                            : 'hover:opacity-80'
                                    }`}
                                    style={{
                                        backgroundColor: pathname === item.path ? 'var(--theme-fg)' : 'transparent',
                                        color: pathname === item.path ? 'var(--theme-bg)' : 'var(--theme-fg)',
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

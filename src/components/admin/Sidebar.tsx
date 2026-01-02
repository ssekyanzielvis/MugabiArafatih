'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    FolderOpen,
    Share2
} from 'lucide-react'
import { useState } from 'react'
import { useAdminTheme } from './AdminThemeContext'
import { showToast } from '@/components/ui/toaster'

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Content', path: '/admin/content', icon: FileText },
    { name: 'Media Library', path: '/admin/media', icon: FolderOpen },
    { name: 'Social Links', path: '/admin/social', icon: Share2 },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { theme, toggleTheme } = useAdminTheme()

    const handleLogout = async () => {
        try {
            showToast('info', 'Logging out...')
            // Add actual logout API call here
            setTimeout(() => {
                router.push('/admin/login')
            }, 500)
        } catch (error) {
            showToast('error', 'Failed to logout')
        }
    }

    return (
        <aside 
            className={`admin-panel border-r-2 transition-all duration-300 ${
                isCollapsed ? 'w-20' : 'w-64'
            } flex flex-col relative`}
            style={{ borderColor: 'var(--admin-border)' }}
        >
            {/* Header */}
            <div className="p-6 border-b-2 flex items-center justify-between min-h-[88px]" style={{ borderColor: 'var(--admin-border)' }}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Portfolio Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                            priority
                        />
                        <div>
                            <h2 className="font-bold text-lg uppercase tracking-tight">Admin</h2>
                            <p className="text-xs opacity-60 font-medium">Dashboard</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 border-2 transition-all hover:shadow-[2px_2px_0_var(--admin-border)] hover:translate-x-[-1px] hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: 'var(--admin-border)' }}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto" role="navigation" aria-label="Main navigation">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.path

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 border-2 transition-all duration-200 font-semibold focus:outline-none focus-visible:ring-2 ${
                                isActive
                                    ? 'admin-button'
                                    : 'border-transparent hover:border-inherit'
                            }`}
                            style={isActive ? {} : { borderColor: 'transparent' }}
                            title={isCollapsed ? item.name : undefined}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon size={20} aria-hidden="true" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t-2 space-y-2" style={{ borderColor: 'var(--admin-border)' }}>
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-3 border-2 border-transparent hover:border-inherit transition-all duration-200 w-full font-semibold focus:outline-none focus-visible:ring-2"
                    title={isCollapsed ? (theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode') : undefined}
                    aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
                    {!isCollapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 border-2 transition-all duration-200 w-full font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: 'var(--admin-border)' }}
                    title={isCollapsed ? 'Logout' : undefined}
                    aria-label="Logout"
                >
                    <LogOut size={20} aria-hidden="true" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    )
}

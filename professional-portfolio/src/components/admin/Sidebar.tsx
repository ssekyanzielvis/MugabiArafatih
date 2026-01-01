'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    Moon
} from 'lucide-react'
import { useState } from 'react'
import { useAdminTheme } from './AdminThemeContext'

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Content', path: '/admin/content', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { theme, toggleTheme } = useAdminTheme()

    const handleLogout = async () => {
        // Logout functionality will be implemented with API route
        window.location.href = '/admin/login'
    }

    return (
        <aside className={`admin-panel border-r border-inherit transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col shadow-none`}>
            {/* Header */}
            <div className="p-6 border-b border-inherit flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-inherit border border-inherit rounded-lg flex items-center justify-center">
                            <span className="font-bold text-xl uppercase">M</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Admin</h2>
                            <p className="text-xs opacity-60">Dashboard</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:invert transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.path

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-none transition-all duration-200 border border-transparent ${isActive
                                ? 'bg-inherit invert'
                                : 'hover:bg-inherit hover:invert'
                                }`}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <Icon size={20} />
                            {!isCollapsed && <span className="font-medium">{item.name}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-inherit space-y-2">
                <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-3 px-4 py-3 rounded-none hover:bg-inherit hover:invert transition-all duration-200 w-full"
                    title={isCollapsed ? (theme === 'light' ? 'Dark Mode' : 'Light Mode') : undefined}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    {!isCollapsed && <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-none hover:bg-red-600 hover:text-white transition-all duration-200 w-full"
                    title={isCollapsed ? 'Logout' : undefined}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    )
}

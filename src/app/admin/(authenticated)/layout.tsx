import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import { checkAdminAccess } from '@/lib/utils/auth'
import '../../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Admin Dashboard - Portfolio Management',
    description: 'Manage your portfolio content and settings',
}

import { AdminThemeProvider } from '@/components/admin/AdminThemeContext'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const hasAccess = await checkAdminAccess()

    if (!hasAccess) {
        redirect('/admin/login')
    }

    return (
        <AdminThemeProvider>
            <div className="admin-panel text-inherit min-h-screen antialiased">
                <div className="flex h-screen overflow-hidden">
                    <AdminSidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 overflow-y-auto p-6 bg-inherit">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </AdminThemeProvider>
    )
}

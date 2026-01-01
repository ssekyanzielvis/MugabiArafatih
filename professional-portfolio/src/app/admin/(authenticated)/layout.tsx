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
        <div className="bg-gray-50 text-gray-900 min-h-screen antialiased">
            <div className="flex h-screen overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

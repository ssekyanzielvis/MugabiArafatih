import UserManagement from '@/components/admin/UserManagement'

export default function UsersPage() {
    return (
        <div className="space-y-8 max-w-7xl">
            {/* Header */}
            <div className="pb-6 border-b-2" style={{ borderColor: 'var(--admin-border)' }}>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">User Management</h1>
                <p className="mt-2 font-medium opacity-70">Manage admin users and permissions</p>
            </div>

            <UserManagement />
        </div>
    )
}

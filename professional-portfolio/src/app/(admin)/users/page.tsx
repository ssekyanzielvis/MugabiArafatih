import UserManagement from '@/components/admin/UserManagement'

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-2">Manage admin users and their permissions</p>
            </div>

            <UserManagement />
        </div>
    )
}

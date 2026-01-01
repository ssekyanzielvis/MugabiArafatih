import UserManagement from '@/components/admin/UserManagement'

export default function UsersPage() {
    return (
        <div className="space-y-10">
            <div className="border-b-4 border-inherit pb-6">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Access Control Center</h1>
                <p className="opacity-60 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage Administrative Protocol and Personnel Permissions</p>
            </div>

            <UserManagement />
        </div>
    )
}

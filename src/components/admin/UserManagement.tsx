'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type UserFormData } from '@/lib/schemas/user'
import { User } from '@/types/user.types'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, Trash2, Edit2, Save, X } from 'lucide-react'

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: 'admin'
        }
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        setLoading(true)
        const { data } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        setUsers(data || [])
        setLoading(false)
    }

    async function onSubmit(data: UserFormData) {
        try {
            if (editingId) {
                // Update existing user
                await supabase
                    .from('users')
                    .update({ full_name: data.full_name, role: data.role })
                    .eq('id', editingId)
            } else {
                // Create new user (requires admin API endpoint)
                // This would typically be done through an API route
                alert('User creation requires backend API implementation')
            }

            fetchUsers()
            reset()
            setEditingId(null)
            setIsAdding(false)
        } catch (error) {
            console.error('Error saving user:', error)
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this user?')) {
            await supabase.from('users').delete().eq('id', id)
            fetchUsers()
        }
    }

    function handleEdit(user: User) {
        setEditingId(user.id)
        setIsAdding(true)
        reset({
            ...user,
            full_name: user.full_name || '',
            password: ''
        })
    }

    function handleCancel() {
        setEditingId(null)
        setIsAdding(false)
        reset()
    }

    const getRoleBadgeStyle = (role: string) => {
        return 'border border-inherit px-2 py-0.5 rounded-full text-xs font-semibold uppercase'
    }

    if (loading) {
        return <div className="text-center py-8 opacity-60">Loading users...</div>
    }

    return (
        <div className="space-y-6">
            {/* Add New Button */}
            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="admin-button flex items-center space-x-2 px-4 py-2"
                >
                    <UserPlus size={20} />
                    <span>Add New User</span>
                </button>
            )}

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="admin-card p-6">
                    <h3 className="text-lg font-bold mb-4 uppercase tracking-tight">
                        {editingId ? 'Edit User' : 'Add New User'}
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase opacity-70">
                                    Full Name
                                </label>
                                <input
                                    {...register('full_name')}
                                    type="text"
                                    className="admin-input w-full px-3 py-2"
                                    placeholder="John Doe"
                                />
                                {errors.full_name && (
                                    <p className="mt-1 text-sm text-red-500 font-bold">{errors.full_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase opacity-70">
                                    Email
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="admin-input w-full px-3 py-2 opacity-50 contrast-50"
                                    placeholder="john@example.com"
                                    disabled={!!editingId}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500 font-bold">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase opacity-70">
                                    Role
                                </label>
                                <select
                                    {...register('role')}
                                    className="admin-input w-full px-3 py-2 bg-inherit"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>

                            {!editingId && (
                                <div>
                                    <label className="block text-sm font-bold mb-2 uppercase opacity-70">
                                        Password
                                    </label>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className="admin-input w-full px-3 py-2"
                                        placeholder="Min. 8 characters"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500 font-bold">{errors.password.message}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="admin-button px-6 py-2 flex items-center space-x-2"
                            >
                                <Save size={18} />
                                <span>Save</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="admin-panel border border-inherit px-6 py-2 flex items-center space-x-2 hover:invert"
                            >
                                <X size={18} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div className="admin-card overflow-hidden">
                <table className="min-w-full divide-y divide-inherit">
                    <thead className="bg-inherit brightness-95">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-inherit divide-y divide-inherit">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-inherit hover:invert-[0.05] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 border border-inherit flex items-center justify-center font-bold">
                                            {user.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold">{user.full_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm opacity-80">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={getRoleBadgeStyle(user.role)}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm opacity-60">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="hover:opacity-60 mr-4 transition-opacity"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="hover:opacity-60 transition-opacity"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

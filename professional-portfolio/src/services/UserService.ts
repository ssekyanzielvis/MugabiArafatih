import { createClient } from '@/lib/supabase/server'
import type { User, CreateUserInput, UpdateUserInput } from '@/types/user.types'

export class UserService {
    /**
     * Get all users
     * @throws {Error} If database query fails
     */
    static async getAllUsers(): Promise<User[]> {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('[UserService] Failed to fetch users:', error)
                throw new Error(`Failed to fetch users: ${error.message}`)
            }
            
            return data || []
        } catch (error) {
            console.error('[UserService] Unexpected error in getAllUsers:', error)
            throw error
        }
    }

    /**
     * Get user by ID
     */
    static async getUserById(id: string): Promise<User | null> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single()

        if (error) return null
        return data
    }

    /**
     * Create new user
     * Note: User creation should be done through Supabase Dashboard or a dedicated admin API
     * This method only creates the user record, not the auth user
     */
    static async createUserRecord(input: Omit<CreateUserInput, 'password'> & { id: string }): Promise<User> {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    id: input.id,
                    email: input.email,
                    full_name: input.full_name,
                    role: input.role,
                },
            ])
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Update user
     * @throws {Error} If user update fails or user not found
     */
    static async updateUser(id: string, input: UpdateUserInput): Promise<User> {
        try {
            if (!id) {
                throw new Error('User ID is required for update')
            }

            const supabase = await createClient()
            const { data, error } = await supabase
                .from('users')
                .update(input)
                .eq('id', id)
                .select()
                .single()

            if (error) {
                console.error(`[UserService] Failed to update user "${id}":`, error)
                throw new Error(`Failed to update user: ${error.message}`)
            }
            
            if (!data) {
                throw new Error(`User with ID "${id}" not found`)
            }
            
            console.log('[UserService] User updated successfully:', id)
            return data
        } catch (error) {
            console.error('[UserService] Unexpected error in updateUser:', error)
            throw error
        }
    }

    /**
     * Delete user record
     * Note: This only deletes from users table, not from auth
     * Auth user deletion should be done through Supabase Dashboard
     * @throws {Error} If user deletion fails
     */
    static async deleteUser(id: string): Promise<void> {
        try {
            if (!id) {
                throw new Error('User ID is required for deletion')
            }

            const supabase = await createClient()
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id)

            if (error) {
                console.error(`[UserService] Failed to delete user "${id}":`, error)
                throw new Error(`Failed to delete user: ${error.message}`)
            }
            
            console.log('[UserService] User deleted successfully:', id)
        } catch (error) {
            console.error('[UserService] Unexpected error in deleteUser:', error)
            throw error
        }
    }

    /**
     * Get users by role
     */
    static async getUsersByRole(role: string): Promise<User[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', role)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    }

    /**
     * Get current user
     */
    static async getCurrentUser(): Promise<User | null> {
        const supabase = await createClient()

        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return null

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

        if (error) return null
        return data
    }
}


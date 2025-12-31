import { createClient } from '@/lib/supabase/server'
import type { User, CreateUserInput, UpdateUserInput } from '@/types/user.types'

export class UserService {
    /**
     * Get all users
     */
    static async getAllUsers(): Promise<User[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
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
     */
    static async updateUser(id: string, input: UpdateUserInput): Promise<User> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('users')
            .update(input)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Delete user record
     * Note: This only deletes from users table, not from auth
     * Auth user deletion should be done through Supabase Dashboard
     */
    static async deleteUser(id: string): Promise<void> {
        const supabase = await createClient()

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)

        if (error) throw error
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


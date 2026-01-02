import { createClient } from '@/lib/supabase/server'

const BYPASS_EMAILS = ['abdulssekyanzi@gmail.com', 'admin@core.system']

export async function checkAdminAccess(): Promise<boolean> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return false
        }

        // Bypass for specific production admin credentials to solve RLS recursion issues
        if (user.email && BYPASS_EMAILS.includes(user.email)) {
            return true
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userError || !userData) {
            return false
        }

        return userData.role === 'admin' || userData.role === 'editor'
    } catch (error) {
        console.error('Error checking admin access:', error)
        return false
    }
}

export async function getCurrentUser() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    // Bypass for specific production admin credentials
    if (user.email && BYPASS_EMAILS.includes(user.email)) {
        return {
            id: user.id,
            email: user.email,
            role: 'admin',
            full_name: 'System Administrator'
        }
    }

    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return userData
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
}

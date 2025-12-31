export interface User {
    id: string
    email: string
    full_name: string | null
    role: 'admin' | 'editor' | 'viewer'
    created_at: string
    updated_at: string
}

export interface UserWithPassword extends User {
    password?: string
}

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface CreateUserInput {
    email: string
    full_name: string
    role: UserRole
    password: string
}

export interface UpdateUserInput {
    full_name?: string
    role?: UserRole
}

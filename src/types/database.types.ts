export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            website_content: {
                Row: {
                    id: string
                    section: string
                    content_type: string
                    key: string
                    value: string | null
                    media_url: string | null
                    media_type: string | null
                    position: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                    created_by: string | null
                }
                Insert: {
                    id?: string
                    section: string
                    content_type: string
                    key: string
                    value?: string | null
                    media_url?: string | null
                    media_type?: string | null
                    position?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
                Update: {
                    id?: string
                    section?: string
                    content_type?: string
                    key?: string
                    value?: string | null
                    media_url?: string | null
                    media_type?: string | null
                    position?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
            }
            contact_submissions: {
                Row: {
                    id: string
                    full_name: string
                    email: string
                    whatsapp_number: string | null
                    message: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    email: string
                    whatsapp_number?: string | null
                    message?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    email?: string
                    whatsapp_number?: string | null
                    message?: string | null
                    status?: string
                    created_at?: string
                }
            }
            analytics: {
                Row: {
                    id: string
                    visitor_id: string | null
                    page_path: string
                    referrer: string | null
                    user_agent: string | null
                    ip_address: string | null
                    country: string | null
                    city: string | null
                    device_type: string | null
                    session_duration: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    visitor_id?: string | null
                    page_path: string
                    referrer?: string | null
                    user_agent?: string | null
                    ip_address?: string | null
                    country?: string | null
                    city?: string | null
                    device_type?: string | null
                    session_duration?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    visitor_id?: string | null
                    page_path?: string
                    referrer?: string | null
                    user_agent?: string | null
                    ip_address?: string | null
                    country?: string | null
                    city?: string | null
                    device_type?: string | null
                    session_duration?: number | null
                    created_at?: string
                }
            }
            daily_visits: {
                Row: {
                    date: string
                    visits: number
                    unique_visitors: number
                    page_views: number
                }
                Insert: {
                    date: string
                    visits?: number
                    unique_visitors?: number
                    page_views?: number
                }
                Update: {
                    date?: string
                    visits?: number
                    unique_visitors?: number
                    page_views?: number
                }
            }
            appearance_settings: {
                Row: {
                    id: string
                    setting_key: string
                    setting_value: Json | null
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    setting_key: string
                    setting_value?: Json | null
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    setting_key?: string
                    setting_value?: Json | null
                    updated_at?: string
                    updated_by?: string | null
                }
            }
        }
    }
}

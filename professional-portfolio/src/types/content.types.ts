export interface WebsiteContent {
    id: string
    section: 'home' | 'kinsmen' | 'collaborate'
    content_type: 'text' | 'media' | 'social'
    key: string
    value: string | null
    media_url: string | null
    media_type: 'image' | 'video' | null
    position: number
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: string | null
}

export interface ContentSection {
    section: 'home' | 'kinsmen' | 'collaborate'
    textContent: WebsiteContent[]
    mediaContent: WebsiteContent[]
    socialContent: WebsiteContent[]
}

export interface CreateContentInput {
    section: 'home' | 'kinsmen' | 'collaborate'
    content_type: 'text' | 'media' | 'social'
    key: string
    value?: string
    media_url?: string
    media_type?: 'image' | 'video'
    position?: number
    is_active?: boolean
}

export interface UpdateContentInput {
    key?: string
    value?: string
    media_url?: string
    media_type?: 'image' | 'video'
    position?: number
    is_active?: boolean
}

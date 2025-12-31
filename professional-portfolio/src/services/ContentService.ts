import { createClient } from '@/lib/supabase/server'
import type { WebsiteContent, CreateContentInput, UpdateContentInput } from '@/types/content.types'

export class ContentService {
    /**
     * Get all content for a section
     */
    static async getContentBySection(section: 'home' | 'kinsmen' | 'collaborate'): Promise<WebsiteContent[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('website_content')
            .select('*')
            .eq('section', section)
            .eq('is_active', true)
            .order('position', { ascending: true })

        if (error) throw error
        return data || []
    }

    /**
     * Get all content (admin)
     */
    static async getAllContent(): Promise<WebsiteContent[]> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('website_content')
            .select('*')
            .order('section', { ascending: true })
            .order('position', { ascending: true })

        if (error) throw error
        return data || []
    }

    /**
     * Get content by ID
     */
    static async getContentById(id: string): Promise<WebsiteContent | null> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('website_content')
            .select('*')
            .eq('id', id)
            .single()

        if (error) return null
        return data
    }

    /**
     * Create new content
     */
    static async createContent(input: CreateContentInput): Promise<WebsiteContent> {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from('website_content')
            .insert([
                {
                    ...input,
                    created_by: user?.id,
                },
            ])
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Update content
     */
    static async updateContent(id: string, input: UpdateContentInput): Promise<WebsiteContent> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('website_content')
            .update(input)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Delete content
     */
    static async deleteContent(id: string): Promise<void> {
        const supabase = await createClient()
        const { error } = await supabase
            .from('website_content')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    /**
     * Toggle content active status
     */
    static async toggleContentActive(id: string, isActive: boolean): Promise<WebsiteContent> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('website_content')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Reorder content
     */
    static async reorderContent(items: { id: string; position: number }[]): Promise<void> {
        const supabase = await createClient()

        for (const item of items) {
            await supabase
                .from('website_content')
                .update({ position: item.position })
                .eq('id', item.id)
        }
    }
}

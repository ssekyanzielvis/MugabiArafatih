import { createClient } from '@/lib/supabase/server'
import type { WebsiteContent, CreateContentInput, UpdateContentInput } from '@/types/content.types'

export class ContentService {
    /**
     * Get all content for a section
     * @throws {Error} If database query fails
     */
    static async getContentBySection(section: 'home' | 'kinsmen' | 'collaborate'): Promise<WebsiteContent[]> {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase
                .from('website_content')
                .select('*')
                .eq('section', section)
                .eq('is_active', true)
                .order('position', { ascending: true })

            if (error) {
                console.error(`[ContentService] Failed to fetch content for section "${section}":`, error)
                throw new Error(`Failed to fetch content: ${error.message}`)
            }
            
            return data || []
        } catch (error) {
            console.error(`[ContentService] Unexpected error in getContentBySection:`, error)
            throw error
        }
    }

    /**
     * Get all content (admin)
     * @throws {Error} If database query fails
     */
    static async getAllContent(): Promise<WebsiteContent[]> {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase
                .from('website_content')
                .select('*')
                .order('section', { ascending: true })
                .order('position', { ascending: true })

            if (error) {
                console.error('[ContentService] Failed to fetch all content:', error)
                throw new Error(`Failed to fetch content: ${error.message}`)
            }
            
            return data || []
        } catch (error) {
            console.error('[ContentService] Unexpected error in getAllContent:', error)
            throw error
        }
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
     * @throws {Error} If content creation fails or user is not authenticated
     */
    static async createContent(input: CreateContentInput): Promise<WebsiteContent> {
        try {
            const supabase = await createClient()
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                console.error('[ContentService] User not authenticated:', authError)
                throw new Error('Authentication required to create content')
            }

            const { data, error } = await supabase
                .from('website_content')
                .insert([
                    {
                        ...input,
                        created_by: user.id,
                    },
                ])
                .select()
                .single()

            if (error) {
                console.error('[ContentService] Failed to create content:', error)
                throw new Error(`Failed to create content: ${error.message}`)
            }
            
            console.log('[ContentService] Content created successfully:', data.id)
            return data
        } catch (error) {
            console.error('[ContentService] Unexpected error in createContent:', error)
            throw error
        }
    }

    /**
     * Update content
     * @throws {Error} If content update fails or content not found
     */
    static async updateContent(id: string, input: UpdateContentInput): Promise<WebsiteContent> {
        try {
            if (!id) {
                throw new Error('Content ID is required for update')
            }

            const supabase = await createClient()
            const { data, error } = await supabase
                .from('website_content')
                .update(input)
                .eq('id', id)
                .select()
                .single()

            if (error) {
                console.error(`[ContentService] Failed to update content "${id}":`, error)
                throw new Error(`Failed to update content: ${error.message}`)
            }
            
            if (!data) {
                throw new Error(`Content with ID "${id}" not found`)
            }
            
            console.log('[ContentService] Content updated successfully:', id)
            return data
        } catch (error) {
            console.error('[ContentService] Unexpected error in updateContent:', error)
            throw error
        }
    }

    /**
     * Delete content
     * @throws {Error} If content deletion fails
     */
    static async deleteContent(id: string): Promise<void> {
        try {
            if (!id) {
                throw new Error('Content ID is required for deletion')
            }

            const supabase = await createClient()
            const { error } = await supabase
                .from('website_content')
                .delete()
                .eq('id', id)

            if (error) {
                console.error(`[ContentService] Failed to delete content "${id}":`, error)
                throw new Error(`Failed to delete content: ${error.message}`)
            }
            
            console.log('[ContentService] Content deleted successfully:', id)
        } catch (error) {
            console.error('[ContentService] Unexpected error in deleteContent:', error)
            throw error
        }
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

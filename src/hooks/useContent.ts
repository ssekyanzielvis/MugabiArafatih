'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { WebsiteContent } from '@/types/content.types'

export function useContent(section?: 'home' | 'kinsmen' | 'collaborate') {
    const [content, setContent] = useState<WebsiteContent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchContent()
    }, [section])

    async function fetchContent() {
        try {
            setLoading(true)
            let query = supabase
                .from('website_content')
                .select('*')
                .eq('is_active', true)
                .order('position', { ascending: true })

            if (section) {
                query = query.eq('section', section)
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError
            setContent(data || [])
        } catch (err) {
            setError(err as Error)
        } finally {
            setLoading(false)
        }
    }

    async function createContent(input: any) {
        const { data, error } = await supabase
            .from('website_content')
            .insert([input])
            .select()
            .single()

        if (error) throw error
        await fetchContent()
        return data
    }

    async function updateContent(id: string, input: any) {
        const { data, error } = await supabase
            .from('website_content')
            .update(input)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        await fetchContent()
        return data
    }

    async function deleteContent(id: string) {
        const { error } = await supabase
            .from('website_content')
            .delete()
            .eq('id', id)

        if (error) throw error
        await fetchContent()
    }

    return {
        content,
        loading,
        error,
        refetch: fetchContent,
        createContent,
        updateContent,
        deleteContent,
    }
}

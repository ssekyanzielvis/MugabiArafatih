import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const section = searchParams.get('section')

        let query = supabase
            .from('website_content')
            .select('*')
            .order('position', { ascending: true })

        if (section) {
            query = query.eq('section', section)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Content API GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('website_content')
            .insert([{ ...body, created_by: user.id }])
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Content API POST error:', error)
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { id, ...updates } = body

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('website_content')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Content API PUT error:', error)
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { error } = await supabase
            .from('website_content')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Content API DELETE error:', error)
        return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
    }
}

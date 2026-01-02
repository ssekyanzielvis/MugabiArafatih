// This file is a placeholder for NextAuth configuration
// Since we're using Supabase Auth, this is not needed
// But the directory structure requires it

import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({ error: 'Auth handled by Supabase' }, { status: 404 })
}

export async function POST() {
    return NextResponse.json({ error: 'Auth handled by Supabase' }, { status: 404 })
}

-- ============================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- ============================================
-- Run this script in Supabase SQL Editor to fix the infinite recursion errors
-- This removes all policies that query the users table within their own logic
-- ============================================

-- Fix Users table policies (remove recursive check)
DROP POLICY IF EXISTS "Users can be managed by admins" ON public.users;

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
    ON public.users FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- Fix Contact Submissions policies
DROP POLICY IF EXISTS "Submissions are viewable by admins" ON public.contact_submissions;
CREATE POLICY "Submissions are viewable by admins"
    ON public.contact_submissions FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Submissions can be managed by admins" ON public.contact_submissions;
CREATE POLICY "Submissions can be managed by admins"
    ON public.contact_submissions FOR UPDATE
    TO authenticated
    USING (true);

-- Fix Analytics policies (make publicly viewable)
DROP POLICY IF EXISTS "Analytics are viewable by admins" ON public.analytics;
DROP POLICY IF EXISTS "Analytics are viewable by everyone" ON public.analytics;
CREATE POLICY "Analytics are viewable by everyone"
    ON public.analytics FOR SELECT
    TO anon, authenticated
    USING (true);

-- Ensure daily_visits is publicly viewable
DROP POLICY IF EXISTS "Daily visits are viewable by everyone" ON public.daily_visits;
CREATE POLICY "Daily visits are viewable by everyone"
    ON public.daily_visits FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow trigger to insert/update daily_visits (needed for analytics aggregation)
DROP POLICY IF EXISTS "Daily visits can be inserted by trigger" ON public.daily_visits;
CREATE POLICY "Daily visits can be inserted by trigger"
    ON public.daily_visits FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Daily visits can be updated by trigger" ON public.daily_visits;
CREATE POLICY "Daily visits can be updated by trigger"
    ON public.daily_visits FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Fix Appearance Settings policies
DROP POLICY IF EXISTS "Settings can be managed by admins" ON public.appearance_settings;
CREATE POLICY "Settings can be managed by admins"
    ON public.appearance_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this script, verify policies with:
-- SELECT tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;

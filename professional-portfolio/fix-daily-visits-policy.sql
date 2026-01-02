-- ============================================
-- FIX DAILY_VISITS RLS POLICIES
-- ============================================
-- The analytics trigger needs to INSERT/UPDATE daily_visits
-- Run this in Supabase SQL Editor immediately
-- ============================================

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

-- ============================================
-- VERIFICATION
-- ============================================
-- Verify the policies were created:
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'daily_visits';

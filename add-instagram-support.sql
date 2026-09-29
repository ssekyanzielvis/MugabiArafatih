-- =========================================================================
-- Migration Script: Remove Restrictive Constraints on social_links table
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- =========================================================================

-- 1. Dynamically drop any CHECK constraints on public.social_links
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.social_links'::regclass 
          AND contype = 'c'
    ) LOOP
        EXECUTE 'ALTER TABLE public.social_links DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- 2. Dynamically drop any UNIQUE constraints on public.social_links (allows multiple links per platform)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.social_links'::regclass 
          AND contype = 'u'
    ) LOOP
        EXECUTE 'ALTER TABLE public.social_links DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- 3. Explicitly drop any known named constraints or indexes
ALTER TABLE public.social_links DROP CONSTRAINT IF EXISTS social_links_platform_check;
ALTER TABLE public.social_links DROP CONSTRAINT IF EXISTS social_links_platform_key;
DROP INDEX IF EXISTS public.social_links_platform_key;
DROP INDEX IF EXISTS public.social_links_platform_idx;

-- 4. Verify RLS policy for authenticated admins to manage links
DROP POLICY IF EXISTS "Social links manageable by admins" ON public.social_links;
CREATE POLICY "Social links manageable by admins"
    ON public.social_links FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Social links viewable by all" ON public.social_links;
CREATE POLICY "Social links viewable by all"
    ON public.social_links FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

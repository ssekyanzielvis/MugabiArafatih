-- Migration script to allow unlimited social links, multiple links per platform, and any custom platforms
-- Run this in your Supabase SQL Editor to remove restrictive constraints on the social_links table.

-- 1. Remove check constraint so any platform (Instagram, WhatsApp, Discord, Custom, etc.) is accepted
ALTER TABLE public.social_links 
    DROP CONSTRAINT IF EXISTS social_links_platform_check;

-- 2. Remove unique constraint on platform so the admin can add multiple accounts/links for any platform
ALTER TABLE public.social_links 
    DROP CONSTRAINT IF EXISTS social_links_platform_key;

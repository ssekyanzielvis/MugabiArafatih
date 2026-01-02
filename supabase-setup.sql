-- ============================================
-- PROFESSIONAL PORTFOLIO - COMPLETE DATABASE SETUP
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This will create all tables, policies, triggers, and sample data
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HOME PAGE TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.home_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    welcome_message TEXT,
    full_name TEXT,
    short_name TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.home_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- ============================================
-- KINSMEN PAGE TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.kinsmen_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    definition TEXT,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.kinsmen_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- ============================================
-- COLLABORATE PAGE TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.collaborate_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.collaborate_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- ============================================
-- SOCIAL MEDIA LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL CHECK (platform IN ('email', 'facebook', 'tiktok', 'youtube', 'twitter')),
    url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    UNIQUE(platform)
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_number TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id TEXT,
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT CHECK (device_type IN ('Desktop', 'Mobile', 'Tablet', NULL)),
    session_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily visits aggregation table
CREATE TABLE IF NOT EXISTS public.daily_visits (
    date DATE PRIMARY KEY,
    visits INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0
);

-- Appearance settings table
CREATE TABLE IF NOT EXISTS public.appearance_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Home content indexes
CREATE INDEX IF NOT EXISTS idx_home_content_active ON public.home_content(is_active);
CREATE INDEX IF NOT EXISTS idx_home_media_active ON public.home_media(is_active);
CREATE INDEX IF NOT EXISTS idx_home_media_position ON public.home_media(position);

-- Kinsmen content indexes
CREATE INDEX IF NOT EXISTS idx_kinsmen_content_active ON public.kinsmen_content(is_active);
CREATE INDEX IF NOT EXISTS idx_kinsmen_media_active ON public.kinsmen_media(is_active);
CREATE INDEX IF NOT EXISTS idx_kinsmen_media_position ON public.kinsmen_media(position);

-- Collaborate content indexes
CREATE INDEX IF NOT EXISTS idx_collaborate_content_active ON public.collaborate_content(is_active);
CREATE INDEX IF NOT EXISTS idx_collaborate_media_active ON public.collaborate_media(is_active);
CREATE INDEX IF NOT EXISTS idx_collaborate_media_position ON public.collaborate_media(position);

-- Social links indexes
CREATE INDEX IF NOT EXISTS idx_social_links_active ON public.social_links(is_active);
CREATE INDEX IF NOT EXISTS idx_social_links_position ON public.social_links(position);

-- Other tables indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON public.analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON public.analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_daily_visits_date ON public.daily_visits(date DESC);

-- ============================================
-- 3. CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply triggers to home tables
DROP TRIGGER IF EXISTS update_home_content_updated_at ON public.home_content;
CREATE TRIGGER update_home_content_updated_at
    BEFORE UPDATE ON public.home_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_home_media_updated_at ON public.home_media;
CREATE TRIGGER update_home_media_updated_at
    BEFORE UPDATE ON public.home_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply triggers to kinsmen tables
DROP TRIGGER IF EXISTS update_kinsmen_content_updated_at ON public.kinsmen_content;
CREATE TRIGGER update_kinsmen_content_updated_at
    BEFORE UPDATE ON public.kinsmen_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kinsmen_media_updated_at ON public.kinsmen_media;
CREATE TRIGGER update_kinsmen_media_updated_at
    BEFORE UPDATE ON public.kinsmen_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply triggers to collaborate tables
DROP TRIGGER IF EXISTS update_collaborate_content_updated_at ON public.collaborate_content;
CREATE TRIGGER update_collaborate_content_updated_at
    BEFORE UPDATE ON public.collaborate_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collaborate_media_updated_at ON public.collaborate_media;
CREATE TRIGGER update_collaborate_media_updated_at
    BEFORE UPDATE ON public.collaborate_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to social_links table
DROP TRIGGER IF EXISTS update_social_links_updated_at ON public.social_links;
CREATE TRIGGER update_social_links_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to appearance_settings table
DROP TRIGGER IF EXISTS update_appearance_settings_updated_at ON public.appearance_settings;
CREATE TRIGGER update_appearance_settings_updated_at
    BEFORE UPDATE ON public.appearance_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. CREATE TRIGGER FOR DAILY VISITS AGGREGATION
-- ============================================

CREATE OR REPLACE FUNCTION aggregate_daily_visits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.daily_visits (date, visits, unique_visitors, page_views)
    VALUES (
        CURRENT_DATE,
        1,
        1,
        1
    )
    ON CONFLICT (date) DO UPDATE SET
        visits = daily_visits.visits + 1,
        page_views = daily_visits.page_views + 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS aggregate_analytics ON public.analytics;
CREATE TRIGGER aggregate_analytics
    AFTER INSERT ON public.analytics
    FOR EACH ROW
    EXECUTE FUNCTION aggregate_daily_visits();

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kinsmen_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kinsmen_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborate_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborate_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CREATE RLS POLICIES
-- ============================================

-- Users table policies
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON public.users;
CREATE POLICY "Users are viewable by authenticated users"
    ON public.users FOR SELECT
    TO authenticated
    USING (true);

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

-- Home Content Policies
DROP POLICY IF EXISTS "Home content viewable by all" ON public.home_content;
CREATE POLICY "Home content viewable by all"
    ON public.home_content FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Home content manageable by admins" ON public.home_content;
CREATE POLICY "Home content manageable by admins"
    ON public.home_content FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Home Media Policies
DROP POLICY IF EXISTS "Home media viewable by all" ON public.home_media;
CREATE POLICY "Home media viewable by all"
    ON public.home_media FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Home media manageable by admins" ON public.home_media;
CREATE POLICY "Home media manageable by admins"
    ON public.home_media FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Kinsmen Content Policies
DROP POLICY IF EXISTS "Kinsmen content viewable by all" ON public.kinsmen_content;
CREATE POLICY "Kinsmen content viewable by all"
    ON public.kinsmen_content FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Kinsmen content manageable by admins" ON public.kinsmen_content;
CREATE POLICY "Kinsmen content manageable by admins"
    ON public.kinsmen_content FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Kinsmen Media Policies
DROP POLICY IF EXISTS "Kinsmen media viewable by all" ON public.kinsmen_media;
CREATE POLICY "Kinsmen media viewable by all"
    ON public.kinsmen_media FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Kinsmen media manageable by admins" ON public.kinsmen_media;
CREATE POLICY "Kinsmen media manageable by admins"
    ON public.kinsmen_media FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Collaborate Content Policies
DROP POLICY IF EXISTS "Collaborate content viewable by all" ON public.collaborate_content;
CREATE POLICY "Collaborate content viewable by all"
    ON public.collaborate_content FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Collaborate content manageable by admins" ON public.collaborate_content;
CREATE POLICY "Collaborate content manageable by admins"
    ON public.collaborate_content FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Collaborate Media Policies
DROP POLICY IF EXISTS "Collaborate media viewable by all" ON public.collaborate_media;
CREATE POLICY "Collaborate media viewable by all"
    ON public.collaborate_media FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Collaborate media manageable by admins" ON public.collaborate_media;
CREATE POLICY "Collaborate media manageable by admins"
    ON public.collaborate_media FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Social Links Policies
DROP POLICY IF EXISTS "Social links viewable by all" ON public.social_links;
CREATE POLICY "Social links viewable by all"
    ON public.social_links FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Social links manageable by admins" ON public.social_links;
CREATE POLICY "Social links manageable by admins"
    ON public.social_links FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Contact submissions policies
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact forms"
    ON public.contact_submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

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

-- Analytics policies
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics;
CREATE POLICY "Anyone can insert analytics"
    ON public.analytics FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Analytics are viewable by everyone" ON public.analytics;
CREATE POLICY "Analytics are viewable by everyone"
    ON public.analytics FOR SELECT
    TO anon, authenticated
    USING (true);

-- Daily visits policies
DROP POLICY IF EXISTS "Daily visits are viewable by everyone" ON public.daily_visits;
CREATE POLICY "Daily visits are viewable by everyone"
    ON public.daily_visits FOR SELECT
    TO anon, authenticated
    USING (true);

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

-- Appearance settings policies
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.appearance_settings;
CREATE POLICY "Settings are viewable by everyone"
    ON public.appearance_settings FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Settings can be managed by admins" ON public.appearance_settings;
CREATE POLICY "Settings can be managed by admins"
    ON public.appearance_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
        )
    );

-- ============================================
-- 7. CREATE STORAGE BUCKETS
-- ============================================

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('home-media', 'home-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']::text[]),
    ('kinsmen-media', 'kinsmen-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']::text[]),
    ('collaborate-media', 'collaborate-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']::text[])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. STORAGE BUCKET RLS POLICIES
-- ============================================

-- Home Media Bucket Policies
DROP POLICY IF EXISTS "Home media files are publicly accessible" ON storage.objects;
CREATE POLICY "Home media files are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'home-media');

DROP POLICY IF EXISTS "Authenticated users can upload home media" ON storage.objects;
CREATE POLICY "Authenticated users can upload home media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'home-media');

DROP POLICY IF EXISTS "Authenticated users can update home media" ON storage.objects;
CREATE POLICY "Authenticated users can update home media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'home-media');

DROP POLICY IF EXISTS "Authenticated users can delete home media" ON storage.objects;
CREATE POLICY "Authenticated users can delete home media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'home-media');

-- Kinsmen Media Bucket Policies
DROP POLICY IF EXISTS "Kinsmen media files are publicly accessible" ON storage.objects;
CREATE POLICY "Kinsmen media files are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'kinsmen-media');

DROP POLICY IF EXISTS "Authenticated users can upload kinsmen media" ON storage.objects;
CREATE POLICY "Authenticated users can upload kinsmen media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'kinsmen-media');

DROP POLICY IF EXISTS "Authenticated users can update kinsmen media" ON storage.objects;
CREATE POLICY "Authenticated users can update kinsmen media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'kinsmen-media');

DROP POLICY IF EXISTS "Authenticated users can delete kinsmen media" ON storage.objects;
CREATE POLICY "Authenticated users can delete kinsmen media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'kinsmen-media');

-- Collaborate Media Bucket Policies
DROP POLICY IF EXISTS "Collaborate media files are publicly accessible" ON storage.objects;
CREATE POLICY "Collaborate media files are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'collaborate-media');

DROP POLICY IF EXISTS "Authenticated users can upload collaborate media" ON storage.objects;
CREATE POLICY "Authenticated users can upload collaborate media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'collaborate-media');

DROP POLICY IF EXISTS "Authenticated users can update collaborate media" ON storage.objects;
CREATE POLICY "Authenticated users can update collaborate media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'collaborate-media');

DROP POLICY IF EXISTS "Authenticated users can delete collaborate media" ON storage.objects;
CREATE POLICY "Authenticated users can delete collaborate media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'collaborate-media');

-- ============================================
-- 9. INSERT SAMPLE DATA
-- ============================================

-- Sample appearance settings
INSERT INTO public.appearance_settings (setting_key, setting_value) VALUES
    ('primary_color', '"#60a5fa"'::jsonb),
    ('secondary_color', '"#c084fc"'::jsonb),
    ('font_family', '"Inter"'::jsonb),
    ('max_width', '"1280px"'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Sample website content for Home section
INSERT INTO public.home_content (welcome_message, full_name, short_name, description, is_active) VALUES
    ('Welcome to My Portfolio', 'Mugabi Arafatih', 'MA', 'Professional developer and creative thinker passionate about building amazing digital experiences.', true)
ON CONFLICT DO NOTHING;

-- Sample website content for Kinsmen section
INSERT INTO public.kinsmen_content (definition, title, description, is_active) VALUES
    ('A kinsman is a person related to another by blood or marriage; a relative.', 'Kinsmen', 'Building connections and fostering relationships within our community.', true)
ON CONFLICT DO NOTHING;

-- Sample website content for Collaborate section
INSERT INTO public.collaborate_content (title, description, is_active) VALUES
    ('Let''s Collaborate', 'I''m always open to new opportunities and collaborations. Feel free to reach out!', true)
ON CONFLICT DO NOTHING;

-- Sample social links
INSERT INTO public.social_links (platform, url, position, is_active) VALUES
    ('email', 'contact@example.com', 1, true),
    ('facebook', 'https://facebook.com/yourprofile', 2, true),
    ('twitter', 'https://twitter.com/yourprofile', 3, true),
    ('youtube', 'https://youtube.com/yourchannel', 4, true),
    ('tiktok', 'https://tiktok.com/@yourprofile', 5, true)
ON CONFLICT (platform) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify tables were created
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify storage buckets were created
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
ORDER BY name;

-- Show table row counts
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL
SELECT 'home_content', COUNT(*) FROM public.home_content
UNION ALL
SELECT 'home_media', COUNT(*) FROM public.home_media
UNION ALL
SELECT 'kinsmen_content', COUNT(*) FROM public.kinsmen_content
UNION ALL
SELECT 'kinsmen_media', COUNT(*) FROM public.kinsmen_media
UNION ALL
SELECT 'collaborate_content', COUNT(*) FROM public.collaborate_content
UNION ALL
SELECT 'collaborate_media', COUNT(*) FROM public.collaborate_media
UNION ALL
SELECT 'social_links', COUNT(*) FROM public.social_links
UNION ALL
SELECT 'contact_submissions', COUNT(*) FROM public.contact_submissions
UNION ALL
SELECT 'analytics', COUNT(*) FROM public.analytics
UNION ALL
SELECT 'daily_visits', COUNT(*) FROM public.daily_visits
UNION ALL
SELECT 'appearance_settings', COUNT(*) FROM public.appearance_settings;

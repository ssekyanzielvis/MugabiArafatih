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

-- Website content table
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL CHECK (section IN ('home', 'kinsmen', 'collaborate')),
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'media', 'social')),
    key TEXT NOT NULL,
    value TEXT,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video', NULL)),
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    UNIQUE(section, key)
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

CREATE INDEX IF NOT EXISTS idx_website_content_section ON public.website_content(section);
CREATE INDEX IF NOT EXISTS idx_website_content_active ON public.website_content(is_active);
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

-- Apply trigger to website_content table
DROP TRIGGER IF EXISTS update_website_content_updated_at ON public.website_content;
CREATE TRIGGER update_website_content_updated_at
    BEFORE UPDATE ON public.website_content
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
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
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

DROP POLICY IF EXISTS "Users can be managed by admins" ON public.users;
CREATE POLICY "Users can be managed by admins"
    ON public.users FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Website content policies
DROP POLICY IF EXISTS "Active content is viewable by everyone" ON public.website_content;
CREATE POLICY "Active content is viewable by everyone"
    ON public.website_content FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "All content is viewable by authenticated users" ON public.website_content;
CREATE POLICY "All content is viewable by authenticated users"
    ON public.website_content FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Content can be managed by admins and editors" ON public.website_content;
CREATE POLICY "Content can be managed by admins and editors"
    ON public.website_content FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

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
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Submissions can be managed by admins" ON public.contact_submissions;
CREATE POLICY "Submissions can be managed by admins"
    ON public.contact_submissions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Analytics policies
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics;
CREATE POLICY "Anyone can insert analytics"
    ON public.analytics FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Analytics are viewable by admins" ON public.analytics;
CREATE POLICY "Analytics are viewable by admins"
    ON public.analytics FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Daily visits policies
DROP POLICY IF EXISTS "Daily visits are viewable by everyone" ON public.daily_visits;
CREATE POLICY "Daily visits are viewable by everyone"
    ON public.daily_visits FOR SELECT
    TO anon, authenticated
    USING (true);

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
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- 7. INSERT SAMPLE DATA
-- ============================================

-- Sample appearance settings
INSERT INTO public.appearance_settings (setting_key, setting_value) VALUES
    ('primary_color', '"#60a5fa"'::jsonb),
    ('secondary_color', '"#c084fc"'::jsonb),
    ('font_family', '"Inter"'::jsonb),
    ('max_width', '"1280px"'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Sample website content for Home section
INSERT INTO public.website_content (section, content_type, key, value, position, is_active) VALUES
    ('home', 'text', 'welcome', 'Welcome to My Portfolio', 1, true),
    ('home', 'text', 'name', 'Mugabi Arafatih', 2, true),
    ('home', 'text', 'short_name', 'MA', 3, true),
    ('home', 'text', 'description', 'Professional developer and creative thinker passionate about building amazing digital experiences.', 4, true)
ON CONFLICT (section, key) DO NOTHING;

-- Sample website content for Kinsmen section
INSERT INTO public.website_content (section, content_type, key, value, position, is_active) VALUES
    ('kinsmen', 'text', 'title', 'Kinsmen', 1, true),
    ('kinsmen', 'text', 'definition', 'A kinsman is a person related to another by blood or marriage; a relative.', 2, true),
    ('kinsmen', 'text', 'description', 'Building connections and fostering relationships within our community.', 3, true)
ON CONFLICT (section, key) DO NOTHING;

-- Sample website content for Collaborate section
INSERT INTO public.website_content (section, content_type, key, value, position, is_active) VALUES
    ('collaborate', 'text', 'title', 'Let''s Collaborate', 1, true),
    ('collaborate', 'text', 'description', 'I''m always open to new opportunities and collaborations. Feel free to reach out!', 2, true),
    ('collaborate', 'social', 'email', 'contact@example.com', 3, true),
    ('collaborate', 'social', 'facebook', 'https://facebook.com/yourprofile', 4, true),
    ('collaborate', 'social', 'twitter', 'https://twitter.com/yourprofile', 5, true),
    ('collaborate', 'social', 'youtube', 'https://youtube.com/yourchannel', 6, true),
    ('collaborate', 'social', 'tiktok', 'https://tiktok.com/@yourprofile', 7, true)
ON CONFLICT (section, key) DO NOTHING;

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

-- Show table row counts
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL
SELECT 'website_content', COUNT(*) FROM public.website_content
UNION ALL
SELECT 'contact_submissions', COUNT(*) FROM public.contact_submissions
UNION ALL
SELECT 'analytics', COUNT(*) FROM public.analytics
UNION ALL
SELECT 'daily_visits', COUNT(*) FROM public.daily_visits
UNION ALL
SELECT 'appearance_settings', COUNT(*) FROM public.appearance_settings;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HOME PAGE CONTENT TABLE
-- ============================================
CREATE TABLE home_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    welcome_message TEXT,
    full_name TEXT,
    short_name TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- HOME PAGE MEDIA TABLE
CREATE TABLE home_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ============================================
-- KINSMEN PAGE CONTENT TABLE
-- ============================================
CREATE TABLE kinsmen_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    definition TEXT,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- KINSMEN PAGE MEDIA TABLE
CREATE TABLE kinsmen_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ============================================
-- COLLABORATE PAGE CONTENT TABLE
-- ============================================
CREATE TABLE collaborate_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- COLLABORATE PAGE MEDIA TABLE
CREATE TABLE collaborate_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- SOCIAL MEDIA LINKS TABLE
CREATE TABLE social_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    platform TEXT NOT NULL CHECK (platform IN ('email', 'facebook', 'tiktok', 'youtube', 'twitter')),
    url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    UNIQUE(platform)
);

-- Contact form submissions
CREATE TABLE contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_number TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics data
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    visitor_id TEXT,
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    session_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily visits summary (for faster queries)
CREATE TABLE daily_visits (
    date DATE PRIMARY KEY,
    visits INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0
);

-- Appearance settings
CREATE TABLE appearance_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_website_content_section ON website_content(section);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_daily_visits_date ON daily_visits(date DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;

-- Policies for website_content (public read, admin write)
CREATE POLICY "Public can view active content" 
    ON website_content FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Admins can manage content" 
    ON website_content FOR ALL 
    USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'editor')));

-- Policies for contact_submissions (public insert, admin read)
CREATE POLICY "Anyone can submit contact form"
    ON contact_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view submissions" 
    ON contact_submissions FOR SELECT
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Only admins can update submissions"
    ON contact_submissions FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Policies for analytics (public insert, admin read)
CREATE POLICY "Anyone can insert analytics"
    ON analytics FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only admins can view analytics"
    ON analytics FOR SELECT
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Policies for users (admin only)
CREATE POLICY "Only admins can manage users"
    ON users FOR ALL
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Policies for appearance_settings (public read, admin write)
CREATE POLICY "Public can view appearance settings"
    ON appearance_settings FOR SELECT
    USING (true);

CREATE POLICY "Only admins can update appearance"
    ON appearance_settings FOR ALL
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at 
    BEFORE UPDATE ON website_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update daily visits
CREATE OR REPLACE FUNCTION update_daily_visits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO daily_visits (date, visits, unique_visitors, page_views)
    VALUES (CURRENT_DATE, 1, 1, 1)
    ON CONFLICT (date) DO UPDATE SET
        visits = daily_visits.visits + 1,
        page_views = daily_visits.page_views + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analytics_daily
    AFTER INSERT ON analytics
    FOR EACH ROW EXECUTE FUNCTION update_daily_visits();

-- Insert default appearance settings
INSERT INTO appearance_settings (setting_key, setting_value) VALUES
('theme', '{"primaryColor": "#60a5fa", "secondaryColor": "#c084fc", "backgroundColor": "#111827"}'),
('typography', '{"fontFamily": "Inter", "fontSize": "16px"}'),
('layout', '{"maxWidth": "1280px", "spacing": "normal"}')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample content (optional - for testing)
INSERT INTO website_content (section, content_type, key, value, position) VALUES
('home', 'text', 'welcome', 'Welcome to My Portfolio', 1),
('home', 'text', 'name', 'Mugabi Arafatih', 2),
('home', 'text', 'short_name', 'MA', 3),
('home', 'text', 'description', 'Professional developer and creative innovator specializing in cutting-edge web solutions.', 4),
('kinsmen', 'text', 'definition', 'Kinsmen refers to a group of people united by common interests, goals, and values.', 1),
('kinsmen', 'text', 'title', 'Our Community', 2),
('kinsmen', 'text', 'description', 'Join a vibrant community of like-minded individuals working together towards excellence.', 3),
('collaborate', 'text', 'title', 'Let''s Work Together', 1),
('collaborate', 'text', 'description', 'I''m always open to new opportunities and collaborations. Get in touch to discuss your project.', 2),
('collaborate', 'social', 'email', 'contact@example.com', 3),
('collaborate', 'social', 'facebook', 'https://facebook.com/yourpage', 4),
('collaborate', 'social', 'twitter', 'https://twitter.com/yourhandle', 5),
('collaborate', 'social', 'youtube', 'https://youtube.com/yourchannel', 6),
('collaborate', 'social', 'tiktok', 'https://tiktok.com/@yourhandle', 7)
ON CONFLICT (section, key) DO NOTHING;

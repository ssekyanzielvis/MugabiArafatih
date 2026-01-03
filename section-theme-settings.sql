-- Section Theme Settings Table
-- Allows admin to configure contrast and saturation for different sections

CREATE TABLE IF NOT EXISTS section_theme_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section TEXT NOT NULL CHECK (section IN ('header', 'home', 'kinsmen', 'collaborate', 'social_links', 'footer')),
    theme_mode TEXT NOT NULL CHECK (theme_mode IN ('dark', 'light')),
    contrast DECIMAL(3,2) DEFAULT 1.00 CHECK (contrast >= 0.5 AND contrast <= 2.0),
    saturation DECIMAL(3,2) DEFAULT 1.00 CHECK (saturation >= 0.0 AND saturation <= 2.0),
    brightness DECIMAL(3,2) DEFAULT 1.00 CHECK (brightness >= 0.5 AND brightness <= 1.5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(section, theme_mode)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_section_theme_settings_section ON section_theme_settings(section);
CREATE INDEX IF NOT EXISTS idx_section_theme_settings_active ON section_theme_settings(is_active);

-- Enable Row Level Security
ALTER TABLE section_theme_settings ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view active settings)
DROP POLICY IF EXISTS "Public can view active section theme settings" ON section_theme_settings;
CREATE POLICY "Public can view active section theme settings" 
    ON section_theme_settings FOR SELECT 
    USING (is_active = true);

-- Admin write policy (only admins can modify settings)
DROP POLICY IF EXISTS "Admins can manage section theme settings" ON section_theme_settings;
CREATE POLICY "Admins can manage section theme settings" 
    ON section_theme_settings FOR ALL 
    USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
            -- Fallback: if users table is empty, allow authenticated users
            NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin')
        )
    );

-- Insert default settings for each section
INSERT INTO section_theme_settings (section, theme_mode, contrast, saturation, brightness)
VALUES 
    ('header', 'dark', 1.00, 1.00, 1.00),
    ('header', 'light', 1.00, 1.00, 1.00),
    ('home', 'dark', 1.00, 1.00, 1.00),
    ('home', 'light', 1.00, 1.00, 1.00),
    ('kinsmen', 'dark', 1.00, 1.00, 1.00),
    ('kinsmen', 'light', 1.00, 1.00, 1.00),
    ('collaborate', 'dark', 1.00, 1.00, 1.00),
    ('collaborate', 'light', 1.00, 1.00, 1.00),
    ('social_links', 'dark', 1.00, 1.00, 1.00),
    ('social_links', 'light', 1.00, 1.00, 1.00),
    ('footer', 'dark', 1.00, 1.00, 1.00),
    ('footer', 'light', 1.00, 1.00, 1.00)
ON CONFLICT (section, theme_mode) DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_section_theme_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS section_theme_settings_updated_at ON section_theme_settings;
CREATE TRIGGER section_theme_settings_updated_at
    BEFORE UPDATE ON section_theme_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_section_theme_settings_updated_at();

COMMENT ON TABLE section_theme_settings IS 'Stores contrast, saturation, and brightness settings for different sections of the website';
COMMENT ON COLUMN section_theme_settings.section IS 'The section identifier (header, home, kinsmen, collaborate, social_links, footer)';
COMMENT ON COLUMN section_theme_settings.theme_mode IS 'Whether this setting applies to dark or light mode';
COMMENT ON COLUMN section_theme_settings.contrast IS 'Contrast multiplier (0.5-2.0, where 1.0 is default)';
COMMENT ON COLUMN section_theme_settings.saturation IS 'Saturation multiplier (0.0-2.0, where 1.0 is default, 0.0 is grayscale)';
COMMENT ON COLUMN section_theme_settings.brightness IS 'Brightness multiplier (0.5-1.5, where 1.0 is default)';

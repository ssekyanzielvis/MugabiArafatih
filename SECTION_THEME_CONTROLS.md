# Section-Specific Theme Controls - Implementation Guide

## Overview
This feature allows administrators to control contrast, saturation, and brightness for different sections of the website independently. For example, you can adjust only the header's contrast without affecting other sections.

## Features Implemented

### 1. Database Schema
- **Table**: `section_theme_settings`
- **Columns**:
  - `section`: Section identifier (header, home, kinsmen, collaborate, social_links, footer)
  - `theme_mode`: dark or light mode
  - `contrast`: 0.5 to 2.0 (default: 1.0)
  - `saturation`: 0.0 to 2.0 (default: 1.0)
  - `brightness`: 0.5 to 1.5 (default: 1.0)
  
### 2. Theme Context Updates
- Added `sectionThemes` to ThemeConfig
- New method: `updateSectionTheme(section, theme)` - Update a specific section's theme
- New method: `getSectionStyle(section)` - Get CSS styles for a section
- New method: `loadSectionThemes()` - Load section themes from database

### 3. Admin Interface
- **Location**: Admin Dashboard → Settings → Section Themes tab
- **Controls**: Each section has sliders for:
  - Contrast (0.5 - 2.0)
  - Saturation (0.0 - 2.0, where 0.0 is grayscale)
  - Brightness (0.5 - 1.5)
- **Features**:
  - Live preview for each section
  - Separate settings for dark and light modes
  - Save/Reset buttons for each section
  - Visual feedback when saved

### 4. API Endpoints
- `GET /api/section-themes` - Fetch all section theme settings
- `POST /api/section-themes` - Save section theme settings
- `DELETE /api/section-themes?section=X&theme_mode=Y` - Reset section to defaults

### 5. Component Integration
- **Header**: Applies header section theme
- **TwoColumnLayout**: Applies section-specific theme (home, kinsmen, collaborate)
- **SocialLinks**: Applies social_links section theme
- **SectionWrapper**: Reusable wrapper component for applying section themes

## How to Use

### For Administrators

1. **Navigate to Settings**
   - Go to Admin Dashboard
   - Click on "Settings" in the sidebar
   - Click the "Section Themes" tab

2. **Choose Theme Mode**
   - The current theme mode (Dark/Light) is displayed at the top
   - Settings are saved separately for each mode
   - Switch mode in "General Settings" tab to configure the other theme

3. **Adjust Section Themes**
   - Each section has three sliders:
     - **Contrast**: Adjust the difference between light and dark
       - < 1.0: Less contrast (softer)
       - 1.0: Normal
       - > 1.0: More contrast (sharper)
     
     - **Saturation**: Adjust color intensity
       - 0.0: Grayscale (black & white)
       - 1.0: Normal colors
       - > 1.0: More vibrant colors
     
     - **Brightness**: Adjust overall lightness
       - < 1.0: Darker
       - 1.0: Normal
       - > 1.0: Brighter

4. **Preview and Save**
   - Each section card shows a live preview
   - Click "Save" to apply changes
   - Click the reset icon to restore defaults (1.0 for all values)

### Example Use Cases

1. **Make Header Stand Out**
   - Increase header contrast to 1.5
   - Increase saturation to 1.2
   - Keep other sections at default (1.0)

2. **Subtle Social Links**
   - Reduce social_links saturation to 0.5 (desaturated)
   - Reduce brightness to 0.8 (slightly darker)

3. **Dramatic Collaborate Section**
   - Increase contrast to 1.8
   - Increase saturation to 1.5
   - Keep brightness at 1.0

## Technical Details

### CSS Filter Application
Section themes are applied using CSS filters:
```css
filter: contrast(1.5) saturate(1.2) brightness(1.0);
```

### Performance Considerations
- Settings are cached in localStorage
- Database queries are minimal (only on initial load and save)
- CSS filters are hardware-accelerated

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Gracefully degrades to default styles in older browsers

## Database Setup

Run the migration script:
```bash
psql -U your_user -d your_database -f section-theme-settings.sql
```

Or in Supabase SQL Editor, paste the contents of `section-theme-settings.sql`.

## Files Modified

### Created
- `section-theme-settings.sql` - Database migration
- `src/components/admin/SectionThemeControls.tsx` - Admin UI component
- `src/components/visitor/SectionWrapper.tsx` - Section wrapper component
- `src/app/api/section-themes/route.ts` - API endpoint
- `src/app/api/social-links/route.ts` - Social links API endpoint

### Modified
- `src/contexts/ThemeContext.tsx` - Added section theme support
- `src/app/admin/(authenticated)/settings/page.tsx` - Added Section Themes tab
- `src/components/visitor/Header.tsx` - Apply header section theme
- `src/components/visitor/TwoColumnLayout.tsx` - Apply section themes
- `src/components/visitor/SocialLinks.tsx` - Apply social_links theme

## Future Enhancements

Potential improvements:
1. Bulk update all sections at once
2. Copy theme settings from one section to another
3. Theme presets (e.g., "High Contrast", "Vibrant", "Minimal")
4. Export/import theme configurations
5. Schedule theme changes (time-based themes)
6. A/B testing different theme configurations

## Troubleshooting

**Q: Changes don't appear immediately**
A: Make sure to:
1. Click the "Save" button for each section
2. Refresh the visitor website page
3. Clear browser cache if needed

**Q: Reset doesn't work**
A: The reset button sets values to 1.0. You still need to click "Save" to persist changes.

**Q: Different sections showing same theme**
A: Verify you're saving settings for the correct theme mode (dark/light). Check which mode is active in General Settings.

**Q: Sliders not responsive**
A: This may be a browser issue. Try:
1. Hard refresh (Ctrl+F5)
2. Clear cache
3. Try a different browser

## Support

For issues or questions:
1. Check browser console for errors
2. Verify database table exists and has RLS policies
3. Ensure user is authenticated as admin
4. Check API endpoints are responding correctly

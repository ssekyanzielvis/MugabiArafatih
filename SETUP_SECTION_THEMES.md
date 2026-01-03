# Quick Setup Guide - Section Theme Controls

## Step 1: Run the Database Migration

You need to run the SQL migration to create the `section_theme_settings` table.

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy the contents of `section-theme-settings.sql`
5. Paste and run the query
6. You should see "Success. No rows returned" message

### Option B: Using psql Command Line
```bash
# If you have PostgreSQL client installed
psql -U your_username -d your_database -f section-theme-settings.sql
```

### Option C: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

## Step 2: Verify the Table Was Created

Run this query in Supabase SQL Editor:
```sql
SELECT * FROM section_theme_settings;
```

You should see 12 rows (6 sections × 2 theme modes) with default values of 1.00.

## Step 3: Access the Feature

1. Log in to your admin dashboard
2. Go to **Settings** (in the sidebar)
3. Click the **Section Themes** tab
4. You'll see controls for each section:
   - Header
   - Home Section
   - Kinsmen Section
   - Collaborate Section
   - Social Links
   - Footer

## Step 4: Test It Out

Try adjusting the header:
1. Find the "Header" card
2. Move the Contrast slider to 1.5
3. Move the Saturation slider to 1.2
4. Click **Save**
5. Open your visitor website in a new tab
6. You should see the header with enhanced contrast and saturation

## Common Issues

### "Table does not exist" error
- Make sure you ran the migration SQL file
- Check if you're connected to the right database

### "Permission denied" error
- The migration includes RLS policies
- Make sure you're running it as a superuser or database owner

### Changes not appearing
1. Clear your browser cache
2. Do a hard refresh (Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for errors
4. Verify the API endpoint is working: open `/api/section-themes` in your browser

### Sliders not saving
- Check that you're logged in as an admin
- Open browser DevTools → Network tab
- Try saving again and check for errors in the POST request

## Next Steps

- Read [SECTION_THEME_CONTROLS.md](./SECTION_THEME_CONTROLS.md) for detailed documentation
- Experiment with different values for each section
- Remember: settings are separate for dark and light modes!

## Support

If you encounter issues:
1. Check the browser console (F12) for JavaScript errors
2. Check the Network tab for failed API requests
3. Verify the database table and policies are set up correctly
4. Make sure you're using the latest code from the repository

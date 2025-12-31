# Environment Variables Configuration

## Your .env.local File

Create a file named `.env.local` in the root of your project with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## How to Get Your Supabase Credentials

### Step 1: Go to Supabase Dashboard
1. Visit https://supabase.com
2. Sign in to your account
3. Select your project (or create a new one)

### Step 2: Get Your Project URL
1. In the Supabase Dashboard, click on **Settings** (gear icon)
2. Click on **API** in the left sidebar
3. Under **Project URL**, copy the URL
   - It looks like: `https://abcdefghijklmnop.supabase.co`
4. Paste it as `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local`

### Step 3: Get Your Anon Key
1. Still in **Settings** → **API**
2. Under **Project API keys**, find **anon** **public**
3. Click the copy icon next to the key
   - It's a long string starting with `eyJ...`
4. Paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local`

### Step 4: Get Your Service Role Key
1. Still in **Settings** → **API**
2. Under **Project API keys**, find **service_role** **secret**
3. Click "Reveal" then copy the key
   - ⚠️ **IMPORTANT**: Keep this secret! Never commit to Git!
4. Paste it as `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`

## Example .env.local File

```env
# Example - Replace with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQzMjAwMCwiZXhwIjoxOTMyMDA4MDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2NDMyMDAwLCJleHAiOjE5MzIwMDgwMDB9.example
```

## Security Notes

### ✅ Safe to Expose (Public)
- `NEXT_PUBLIC_SUPABASE_URL` - This is public
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - This is public (protected by RLS)

### ⚠️ KEEP SECRET (Never Commit)
- `SUPABASE_SERVICE_ROLE_KEY` - This bypasses RLS! Keep it secret!

### .gitignore Protection
Your `.env.local` file is already in `.gitignore`, so it won't be committed to Git.

## Verify Configuration

After creating `.env.local`:

1. Restart your development server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. Check the console for any Supabase connection errors

3. Visit http://localhost:3000 - the site should load without errors

## For Production (Vercel)

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Apply to: Production, Preview, Development

## Troubleshooting

### Error: "Invalid API key"
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Verify you're using the correct project

### Error: "supabase is not defined"
- Restart your development server
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `npm install`

### Error: "Failed to fetch"
- Check your internet connection
- Verify the Supabase URL is correct
- Check if your Supabase project is paused (free tier)

## Quick Setup Checklist

- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Restarted development server
- [ ] Verified no connection errors
- [ ] Tested visiting http://localhost:3000

---

**Next Steps:**
1. ✅ Configure environment variables (this file)
2. Run `supabase-setup.sql` in Supabase SQL Editor
3. Create storage bucket (see `STORAGE_BUCKET_SETUP.md`)
4. Create first admin user
5. Start developing!

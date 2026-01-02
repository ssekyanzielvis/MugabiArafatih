# ============================================
# RENDER DEPLOYMENT GUIDE
# ============================================
# Complete guide for deploying to Render.com
# ============================================

## Quick Fix for Current Error

Your error: `Root directory "professional-portifolio" does not exist`

### Fix Steps:
1. Go to Render Dashboard → Your Service → **Settings**
2. Find **Root Directory** field
3. **Clear it completely** (leave empty) OR set to `./`
4. Scroll down and click **Save Changes**
5. Go to **Manual Deploy** → Click **Deploy latest commit**

## Render Configuration

### Option 1: Use render.yaml (Recommended)

I've created [render.yaml](render.yaml) which automatically configures everything.

**To use it:**
1. Commit and push render.yaml to your GitHub repo
2. Render will auto-detect and use these settings
3. You still need to add `NEXT_PUBLIC_SUPABASE_ANON_KEY` manually (see below)

### Option 2: Manual Configuration

If not using render.yaml, configure these settings in Render Dashboard:

#### Build & Deploy Settings
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Root Directory:** (leave empty or `./`)

#### Environment Variables
Add these in Settings → Environment:

```
NODE_VERSION=20.11.0
NEXT_PUBLIC_SUPABASE_URL=https://bqlvprmmtmobobyygnba.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbHZwcm1tdG1vYm9ieXlnbmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMDQzOTMsImV4cCI6MjA4Mjc4MDM5M30.855ipDTO8Ne97TIcqLe8o847PEs3jLFwfR6SV6Qassk
```

## Deploy to Render

### First Time Setup

1. **Push to GitHub** (if not already done):
   ```powershell
   git add .
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Create New Web Service**:
   - Go to https://render.com/dashboard
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**:
   - **Name:** professional-portfolio
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**:
   - Click **Advanced**
   - Add the three variables listed above

5. **Deploy**:
   - Click **Create Web Service**
   - Wait 5-10 minutes for first build

### Updating Deployment

Every push to `main` branch auto-deploys. Or manually:
1. Render Dashboard → Your Service
2. **Manual Deploy** → **Deploy latest commit**

## Render vs Vercel Comparison

| Feature | Render | Vercel |
|---------|--------|--------|
| **Build Time** | 5-10 min | 2-3 min |
| **Cold Starts** | ~1-2 sec | Instant |
| **Free Tier** | 750 hrs/month | Unlimited |
| **Best For** | Full-stack apps | Next.js apps |
| **Deploy Speed** | Slower | Faster |
| **Custom Domain** | ✅ Free | ✅ Free |

## Recommendation for Your Portfolio

### Use Vercel for:
- ✅ Faster builds (2-3 min vs 5-10 min)
- ✅ Better Next.js optimization
- ✅ Instant page loads (no cold starts)
- ✅ Built specifically for Next.js

### Use Render for:
- ✅ Full-stack apps with background jobs
- ✅ Non-Next.js frameworks
- ✅ Need more control over server

**My Suggestion:** Since you have a pure Next.js app, **Vercel is ideal**. Keep Render as backup.

## Troubleshooting Render

### Build Fails
**Check Build Logs:**
1. Dashboard → Your Service → **Logs** tab
2. Look for errors in build output
3. Common issues:
   - Missing dependencies → Add to package.json
   - Build timeout → Upgrade plan or optimize build
   - Memory issues → Reduce build size

### Environment Variables Not Working
1. Settings → Environment
2. Verify all variables are set
3. Click **Save Changes**
4. **Important:** Redeploy after changing env vars

### Site Loads but Features Broken
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure database is set up (run supabase-setup.sql)
- Check that RLS policies are configured

### Slow Performance
- Render free tier has cold starts (first request is slow)
- Consider upgrading to paid plan ($7/month) for faster performance
- Or switch to Vercel (no cold starts on free tier)

## Post-Deployment

### Configure Supabase
Add your Render URL to Supabase:
1. Supabase Dashboard → Settings → Authentication
2. Add to Site URL: `https://your-app.onrender.com`
3. Add to Redirect URLs: `https://your-app.onrender.com/**`

### Custom Domain (Optional)
1. Render Dashboard → Settings → Custom Domains
2. Add your domain
3. Update DNS records at your registrar:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: your-app.onrender.com
   ```

## Quick Commands

```powershell
# Push updates (auto-deploys)
git add .
git commit -m "Your update message"
git push origin main

# Check deployment status
# Visit: https://dashboard.render.com

# View logs
# Dashboard → Your Service → Logs
```

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Status: https://status.render.com

## Summary

**Current Issue:** Root directory misconfigured  
**Fix:** Clear "Root Directory" field in Settings  
**Alternative:** Use Vercel (faster, better for Next.js)  

Your site will be live at: `https://professional-portfolio-XXXX.onrender.com`

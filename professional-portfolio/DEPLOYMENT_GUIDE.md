# Deployment Guide - Professional Portfolio Website

## Quick Start Deployment

### Prerequisites Checklist
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Storage bucket created
- [ ] Environment variables ready
- [ ] First admin user created

## Step 1: Supabase Setup (5 minutes)

### Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - Name: professional-portfolio
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait 2-3 minutes for initialization

### Execute Database Schema
1. In Supabase Dashboard, go to SQL Editor
2. Click "New Query"
3. Copy entire contents from `database-schema.sql`
4. Click "Run"
5. Verify success message

### Create Storage Bucket
1. Go to Storage section
2. Click "New Bucket"
3. Name: `portfolio-media`
4. Set to Public
5. Click "Create Bucket"

### Get API Credentials
1. Go to Project Settings > API
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key (keep secret!)

## Step 2: Create First Admin User

### Method 1: Supabase Dashboard
1. Go to Authentication > Users
2. Click "Add User"
3. Enter:
   - Email: your-admin@email.com
   - Password: (min 8 characters)
   - Auto Confirm: Yes
4. Click "Create User"
5. Copy the User ID

### Add User to Database
1. Go to Table Editor > users
2. Click "Insert Row"
3. Fill in:
   - id: (paste User ID from above)
   - email: your-admin@email.com
   - full_name: Your Name
   - role: admin
4. Click "Save"

## Step 3: Local Testing

### Configure Environment
1. Create `.env.local` file in project root
2. Add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Install and Run
```bash
npm install
npm run dev
```

### Test Locally
1. Visit http://localhost:3000
   - Verify visitor website loads
   - Check navigation works
   - Test contact form (optional)

2. Visit http://localhost:3000/dashboard
   - Log in with admin credentials
   - Verify dashboard loads
   - Test content management
   - Check analytics page

## Step 4: Deploy to Vercel

### Method A: GitHub + Vercel (Recommended)

#### Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

#### Deploy via Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add all three variables from `.env.local`
   - Apply to: Production, Preview, Development
6. Click "Deploy"
7. Wait 2-3 minutes for deployment

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? professional-portfolio
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

## Step 5: Post-Deployment

### Verify Deployment
1. Visit your Vercel URL (e.g., portfolio.vercel.app)
2. Test visitor website
3. Test admin login at /dashboard
4. Verify all features work

### Add Custom Domain (Optional)
1. In Vercel Dashboard, go to Settings > Domains
2. Add your domain (e.g., yourname.com)
3. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   OR
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate auto-generated

### Configure Supabase for Production
1. In Supabase Dashboard, go to Authentication > URL Configuration
2. Add your production URL to:
   - Site URL: https://yourdomain.com
   - Redirect URLs: https://yourdomain.com/**

## Step 6: Initial Content Setup

### Add Content via Admin Dashboard
1. Log in to /dashboard
2. Go to Content section
3. For each section (Home, Kinsmen, Collaborate):
   - Add text content
   - Upload media files
   - Set positions
   - Activate content

### Upload Media
1. In Content section, use Media Uploader
2. Drag and drop images/videos
3. Copy uploaded URLs
4. Use URLs in content items

### Update Social Links
1. Go to Content > Collaborate tab
2. Edit social media links:
   - email
   - facebook
   - twitter
   - youtube
   - tiktok

## Troubleshooting

### Build Fails
**Error**: Module not found
**Fix**: Ensure all dependencies installed: `npm install`

**Error**: Environment variables missing
**Fix**: Add all three env vars in Vercel

### Can't Login
**Error**: Invalid credentials
**Fix**: 
1. Verify user exists in Supabase Auth
2. Check user has admin role in users table
3. Try password reset

### Content Not Showing
**Error**: Content appears in admin but not visitor site
**Fix**: 
1. Check `is_active` is true
2. Verify RLS policies are correct
3. Check Supabase connection

### Images Not Loading
**Error**: 404 on image URLs
**Fix**:
1. Verify storage bucket is public
2. Check file was uploaded successfully
3. Verify URL is correct

## Performance Optimization

### After Deployment
1. Enable Vercel Analytics (optional)
2. Set up monitoring
3. Configure caching headers
4. Optimize images (use WebP)

### Recommended Settings
- Enable Vercel Speed Insights
- Set up error tracking (Sentry)
- Configure CDN for media files
- Enable compression

## Maintenance

### Regular Tasks
- **Daily**: Check contact submissions
- **Weekly**: Review analytics
- **Monthly**: Update content
- **Quarterly**: Update dependencies

### Backup Strategy
- Supabase auto-backups (daily)
- Export important data monthly
- Keep local copy of media files

## Security Checklist
- [ ] Environment variables set correctly
- [ ] Service role key kept secret
- [ ] RLS policies enabled
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Strong admin passwords
- [ ] Regular security updates

## Support

### Getting Help
- Check PROJECT_DOCUMENTATION.md
- Review README.md
- Check Supabase logs
- Review Vercel deployment logs

### Common Resources
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Deployment Complete!** 🎉

Your professional portfolio is now live and ready to showcase your work.

Next steps:
1. Add your content
2. Upload media files
3. Customize appearance
4. Share your URL!

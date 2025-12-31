# PROFESSIONAL PORTFOLIO WEBSITE - COMPLETE DOCUMENTATION

## TABLE OF CONTENTS
1. Project Overview
2. Architecture & Design
3. Technology Stack
4. Installation & Setup Guide
5. Database Schema
6. Features Documentation
7. Admin Dashboard Guide
8. API Documentation
9. Deployment Guide
10. Troubleshooting
11. Maintenance & Updates

---

## 1. PROJECT OVERVIEW

### 1.1 Introduction
This is a professional dual-view portfolio website designed to showcase a person's work and expertise while providing comprehensive administrative control through a powerful dashboard.

### 1.2 Key Components
- **Visitor Website**: Public-facing dark-themed portfolio
- **Admin Dashboard**: Comprehensive management interface
- **Database**: Supabase PostgreSQL with RLS
- **Storage**: Supabase Storage for media files
- **Analytics**: Real-time visitor tracking with predictive algorithms

### 1.3 Target Users
- **Visitors**: Potential clients, collaborators, and general audience
- **Administrators**: Content managers and website owners

---

## 2. ARCHITECTURE & DESIGN

### 2.1 Clean Architecture Principles
The project follows clean architecture with clear separation of concerns:

```
Presentation Layer (UI Components)
    ↓
Application Layer (Business Logic)
    ↓
Infrastructure Layer (Supabase, External Services)
```

### 2.2 Technology Choices

**Frontend Framework**: Next.js 16 with App Router
- Server-side rendering for SEO
- React Server Components for performance
- Built-in routing and API routes

**Styling**: Tailwind CSS v4
- Utility-first approach
- Dark theme support
- Responsive design utilities

**Database**: Supabase (PostgreSQL)
- Real-time capabilities
- Row Level Security
- Built-in authentication

**State Management**: React Hooks + Server Components
- Minimal client-side state
- Server-first data fetching

---

## 3. TECHNOLOGY STACK

### 3.1 Core Dependencies
- next: 16.1.1
- react: 19.2.3
- typescript: ^5
- tailwindcss: ^4

### 3.2 Supabase Integration
- @supabase/supabase-js: Latest
- @supabase/ssr: Latest

### 3.3 UI & Forms
- react-hook-form: Form management
- zod: Schema validation
- lucide-react: Icon library
- recharts: Analytics charts

### 3.4 Utilities
- date-fns: Date formatting
- clsx: Conditional classes
- class-variance-authority: Component variants

---

## 4. INSTALLATION & SETUP GUIDE

### 4.1 Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- Supabase account
- Vercel account (for deployment)

### 4.2 Step-by-Step Setup

#### Step 1: Project Installation
```bash
cd professional-portfolio
npm install
```

#### Step 2: Supabase Project Setup
1. Go to https://supabase.com
2. Create a new project
3. Wait for project initialization (2-3 minutes)
4. Note your project URL and API keys

#### Step 3: Database Schema Setup
1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Copy contents from `database-schema.sql`
4. Execute the SQL script
5. Verify all tables are created

#### Step 4: Storage Bucket Setup
1. Go to Storage in Supabase Dashboard
2. Create new bucket named `portfolio-media`
3. Set bucket to Public
4. Configure CORS if needed

#### Step 5: Environment Configuration
1. Copy `env.example.txt` to `.env.local`
2. Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Step 6: Create First Admin User
1. In Supabase Dashboard, go to Authentication
2. Click "Add User"
3. Enter email and password
4. Go to Table Editor > users
5. Insert row with user ID and role='admin'

#### Step 7: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 for visitor site
Visit http://localhost:3000/dashboard for admin dashboard

---

## 5. DATABASE SCHEMA

### 5.1 Tables Overview

#### users
Stores admin user information
- id: UUID (Primary Key, references auth.users)
- email: TEXT (Unique)
- full_name: TEXT
- role: TEXT (admin, editor, viewer)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

#### website_content
Stores all website content
- id: UUID (Primary Key)
- section: TEXT (home, kinsmen, collaborate)
- content_type: TEXT (text, media, social)
- key: TEXT
- value: TEXT
- media_url: TEXT
- media_type: TEXT (image, video)
- position: INTEGER
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- created_by: UUID (Foreign Key)

#### contact_submissions
Stores form submissions
- id: UUID (Primary Key)
- full_name: TEXT
- email: TEXT
- whatsapp_number: TEXT
- message: TEXT
- status: TEXT (pending, reviewed, contacted, archived)
- created_at: TIMESTAMP

#### analytics
Stores visitor tracking data
- id: UUID (Primary Key)
- visitor_id: TEXT
- page_path: TEXT
- referrer: TEXT
- user_agent: TEXT
- ip_address: TEXT
- country: TEXT
- city: TEXT
- device_type: TEXT
- session_duration: INTEGER
- created_at: TIMESTAMP

#### daily_visits
Aggregated daily statistics
- date: DATE (Primary Key)
- visits: INTEGER
- unique_visitors: INTEGER
- page_views: INTEGER

#### appearance_settings
Customization settings
- id: UUID (Primary Key)
- setting_key: TEXT (Unique)
- setting_value: JSONB
- updated_at: TIMESTAMP
- updated_by: UUID (Foreign Key)

### 5.2 Row Level Security (RLS)

All tables have RLS enabled with policies:
- Public can view active content
- Only authenticated admins can modify data
- Analytics can be inserted by anyone, read by admins only

---

## 6. FEATURES DOCUMENTATION

### 6.1 Visitor Website Features

#### Home Page
- Large welcome message with gradient text
- Name and short name display
- Professional description
- Two-column layout with media and content
- Smooth animations on scroll

#### Kinsmen Page
- Definition of Kinsmen
- Title and description
- Media gallery
- Two-column responsive layout

#### Collaborate Page
- Collaboration information
- Social media links (Email, Facebook, Twitter, YouTube, TikTok)
- Contact form with validation
- WhatsApp integration

#### Contact Form
- Fields: Full Name, Email, WhatsApp Number, Message
- Client-side validation with Zod
- Real-time error messages
- Success/error feedback
- Automatic submission to database

### 6.2 Admin Dashboard Features

#### Dashboard Overview
- Quick statistics cards
- Total visits counter
- Contact submissions count
- Content items count
- Growth rate display
- Quick action links

#### Content Management
- Tabbed interface for sections
- Add, edit, delete content
- Media uploader with drag-and-drop
- Position ordering
- Active/inactive toggle
- Real-time preview

#### Analytics Dashboard
- Time range selector (7 days, 30 days)
- Visitor statistics
- Line chart: Visits over time
- Pie chart: Device distribution
- Bar chart: Page views by path
- Predictive analytics with trend lines
- Growth rate calculations
- Contact submissions table

#### User Management
- User list with roles
- Add new admin users
- Edit user details
- Delete users
- Role assignment (admin, editor, viewer)

#### Settings
- Color customization
- Typography selection
- Layout configuration
- Live preview of changes

---

## 7. ADMIN DASHBOARD GUIDE

### 7.1 Logging In
1. Navigate to /dashboard
2. Enter admin credentials
3. Access dashboard

### 7.2 Managing Content

#### Adding New Content
1. Go to Content section
2. Select section tab (Home, Kinsmen, Collaborate)
3. Click "Add New Content"
4. Fill in form:
   - Content Type: text, media, or social
   - Key: Identifier (e.g., "welcome", "title")
   - Value: Content text
   - Position: Display order
   - Active: Toggle visibility
5. Click Save

#### Uploading Media
1. Go to Content section
2. Drag and drop files or click to browse
3. Supported formats: JPG, PNG, GIF, WebP, MP4, WebM
4. Max file size: 10MB
5. Copy the uploaded URL
6. Use URL in content items

#### Editing Content
1. Find content item in list
2. Click edit icon
3. Modify fields
4. Click Save

#### Deleting Content
1. Find content item
2. Click delete icon
3. Confirm deletion

### 7.3 Viewing Analytics

#### Understanding Metrics
- **Total Visits**: All page views
- **Unique Visitors**: Distinct visitors
- **Avg. Duration**: Average session time
- **Bounce Rate**: Single-page visits percentage

#### Predictive Analytics
The system uses linear regression to predict future visits based on historical trends. The prediction line shows expected traffic for the next 7 days.

#### Contact Submissions
View all form submissions with:
- Name and email
- WhatsApp number
- Submission date
- Status (pending, reviewed, contacted, archived)

### 7.4 Managing Users

#### Adding Admin Users
1. Go to Users section
2. Click "Add New User"
3. Enter details:
   - Full Name
   - Email
   - Password (min 8 characters)
   - Role (admin, editor, viewer)
4. Click Save

#### Role Descriptions
- **Admin**: Full access to all features
- **Editor**: Can manage content, view analytics
- **Viewer**: Read-only access

---

## 8. API DOCUMENTATION

### 8.1 Content API

#### Get Content
```typescript
GET /api/content?section=home
Response: Array of content items
```

#### Create Content
```typescript
POST /api/content
Body: ContentFormData
Response: Created content item
```

#### Update Content
```typescript
PUT /api/content/:id
Body: ContentFormData
Response: Updated content item
```

#### Delete Content
```typescript
DELETE /api/content/:id
Response: Success message
```

### 8.2 Analytics API

#### Track Visit
```typescript
POST /api/analytics
Body: { page_path, visitor_id, device_type }
Response: Success
```

#### Get Analytics
```typescript
GET /api/analytics?range=7days
Response: Analytics data with charts
```

---

## 9. DEPLOYMENT GUIDE

### 9.1 Vercel Deployment

#### Method 1: GitHub Integration
1. Push code to GitHub
2. Go to vercel.com
3. Click "New Project"
4. Import your repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
6. Add environment variables
7. Click Deploy

#### Method 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts to deploy

### 9.2 Environment Variables for Production
Add these in Vercel Dashboard:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

### 9.3 Custom Domain
1. In Vercel Dashboard, go to Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

### 9.4 Post-Deployment Checklist
- [ ] Test visitor website
- [ ] Test admin login
- [ ] Verify content management works
- [ ] Check analytics tracking
- [ ] Test contact form submission
- [ ] Verify media uploads
- [ ] Test on mobile devices

---

## 10. TROUBLESHOOTING

### 10.1 Common Issues

#### Build Errors
**Issue**: TypeScript errors during build
**Solution**: Run `npm run build` locally to identify issues

**Issue**: Missing environment variables
**Solution**: Verify all variables in `.env.local`

#### Authentication Issues
**Issue**: Cannot log in to admin
**Solution**: 
1. Check user exists in Supabase Auth
2. Verify user has admin role in users table
3. Clear browser cookies

#### Database Connection
**Issue**: Cannot connect to Supabase
**Solution**:
1. Verify Supabase URL and keys
2. Check project is not paused
3. Verify RLS policies are correct

#### Media Upload Fails
**Issue**: Files not uploading
**Solution**:
1. Check storage bucket exists
2. Verify bucket is public
3. Check file size < 10MB
4. Verify file type is supported

### 10.2 Performance Optimization

#### Image Optimization
- Use Next.js Image component
- Compress images before upload
- Use WebP format when possible

#### Database Queries
- Indexes are already created
- Use pagination for large datasets
- Cache frequently accessed data

---

## 11. MAINTENANCE & UPDATES

### 11.1 Regular Maintenance Tasks

#### Weekly
- Review contact submissions
- Check analytics for anomalies
- Backup database (Supabase auto-backups)

#### Monthly
- Update dependencies: `npm update`
- Review and archive old submissions
- Check storage usage

#### Quarterly
- Security audit
- Performance review
- Content audit

### 11.2 Updating Content
Use the admin dashboard to keep content fresh:
- Update home page description
- Add new media
- Update social media links
- Refresh collaboration information

### 11.3 Scaling Considerations

#### Database
- Supabase free tier: 500MB database
- Upgrade to Pro for more storage
- Archive old analytics data

#### Storage
- Free tier: 1GB storage
- Compress media files
- Use CDN for large files

#### Traffic
- Vercel free tier: 100GB bandwidth
- Upgrade for higher traffic
- Enable caching

---

## APPENDIX A: File Structure Reference

```
professional-portfolio/
├── src/
│   ├── app/
│   │   ├── (visitor)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── kinsmen/page.tsx
│   │   │   └── collaborate/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── content/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── visitor/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TwoColumnLayout.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── SocialLinks.tsx
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   ├── ContentEditor.tsx
│   │   │   ├── MediaUploader.tsx
│   │   │   └── UserManagement.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       └── toast.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── utils/
│   │   │   ├── auth.ts
│   │   │   ├── analytics.ts
│   │   │   └── formatters.ts
│   │   └── schemas/
│   │       ├── content.ts
│   │       ├── contact.ts
│   │       └── user.ts
│   └── middleware.ts
├── database-schema.sql
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## APPENDIX B: Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Deployment
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production

# Database
# Run in Supabase SQL Editor
# See database-schema.sql
```

---

## APPENDIX C: Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org/

### Community
- Next.js Discord
- Supabase Discord
- Stack Overflow

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Author**: Professional Portfolio Development Team

---

END OF DOCUMENTATION

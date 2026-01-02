# Professional Portfolio Website

A modern, full-featured portfolio website with a dark-themed visitor view and comprehensive admin dashboard built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Visitor Website
- **Dark Theme Design**: Beautiful dark background with white text and gradient accents
- **Three Main Sections**:
  - **Home**: Welcome message, name, description with hero section
  - **Kinsmen**: Community information and description
  - **Collaborate**: Contact information, social media links, and contact form
- **Two-Column Layout**: Media (images/videos) on the left, content on the right
- **Responsive Design**: Fully responsive across all devices
- **Contact Form**: Validated form with WhatsApp number, email, and full name

### Admin Dashboard
- **Content Management**: Full CRUD operations for all website content
- **Media Upload**: Drag-and-drop file upload to Supabase Storage
- **Analytics Dashboard**:
  - Visitor tracking with device type detection
  - Line charts for visits over time
  - Pie charts for device distribution
  - Bar charts for page views
  - **Predictive Analytics**: Linear regression for trend prediction
  - Growth rate calculations
- **User Management**: Create, edit, and delete admin users with role-based access
- **Appearance Settings**: Customize colors, typography, and layout
- **Contact Submissions**: View and manage form submissions

## 🚀 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Charts**: Recharts
- **Form Validation**: React Hook Form + Zod
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd professional-portfolio
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Run the SQL schema from `database-schema.sql` in the SQL Editor
4. Create a storage bucket named `portfolio-media` and make it public

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory (use `env.example.txt` as reference):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Create First Admin User

In Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Add User" and create an admin account
3. Go to Table Editor > users table
4. Insert a row with the user's ID and set role to 'admin'

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the visitor website.
Access admin dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 📁 Project Structure

```
src/
├── app/
│   ├── (visitor)/          # Visitor website pages
│   │   ├── page.tsx        # Home page
│   │   ├── kinsmen/        # Kinsmen page
│   │   └── collaborate/    # Collaborate page
│   ├── (admin)/            # Admin dashboard pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── content/        # Content management
│   │   ├── analytics/      # Analytics & submissions
│   │   ├── users/          # User management
│   │   └── settings/       # Appearance settings
│   └── globals.css         # Global styles
├── components/
│   ├── visitor/            # Visitor components
│   ├── admin/              # Admin components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── utils/              # Utility functions
│   └── schemas/            # Zod validation schemas
└── middleware.ts           # Route protection
```

## 🎨 Customization

### Content Management
1. Log in to admin dashboard
2. Navigate to Content section
3. Select section (Home, Kinsmen, Collaborate)
4. Add, edit, or delete content items
5. Upload media files using the drag-and-drop uploader

### Appearance Settings
1. Go to Settings in admin dashboard
2. Customize colors, fonts, and layout
3. Changes apply immediately

## 📊 Analytics Features

- **Real-time Tracking**: Automatic visitor tracking on all pages
- **Device Detection**: Identifies Desktop, Mobile, and Tablet users
- **Predictive Analytics**: Uses linear regression to forecast future visits
- **Growth Metrics**: Calculates week-over-week growth rates
- **Visual Reports**: Interactive charts and graphs

## 🔒 Security

- Row Level Security (RLS) policies on all tables
- Protected admin routes with middleware
- Secure file uploads to Supabase Storage
- Environment variables for sensitive data

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

## 📝 Database Schema

The database includes:
- `users`: Admin user accounts
- `website_content`: All website content
- `contact_submissions`: Form submissions
- `analytics`: Visitor tracking data
- `daily_visits`: Aggregated visit statistics
- `appearance_settings`: Customization settings

See `database-schema.sql` for complete schema.

## 🤝 Support

For issues or questions, please refer to the comprehensive documentation in `PROJECT_DOCUMENTATION.docx`.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS

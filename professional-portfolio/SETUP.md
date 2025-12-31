# Setup Instructions

## Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create project at https://supabase.com
2. Run `database-schema.sql` in SQL Editor
3. Create storage bucket: `portfolio-media` (public)
4. Copy your credentials

### 3. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

### 4. Create Admin User
1. Add user in Supabase Auth
2. Add user to `users` table with role='admin'

### 5. Run Development Server
```bash
npm run dev
```

Visit:
- Visitor site: http://localhost:3000
- Admin dashboard: http://localhost:3000/dashboard

## Deployment
See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.

## Documentation
- `README.md` - Project overview
- `PROJECT_DOCUMENTATION.md` - Complete documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `database-schema.sql` - Database setup

## Need Help?
Check the comprehensive documentation files above.

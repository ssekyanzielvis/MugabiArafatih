# 🚀 QUICK START GUIDE - Professional Portfolio

## Your Supabase Project
**URL:** https://bqlvprmmtmobobyygnba.supabase.co
**Dashboard:** https://supabase.com/dashboard/project/bqlvprmmtmobobyygnba

---

## ⚡ 3-Step Setup (5 minutes)

### 1️⃣ Database Setup (2 min)
```
1. Open: https://supabase.com/dashboard/project/bqlvprmmtmobobyygnba/sql
2. Click "New Query"
3. Copy ALL from: supabase-setup.sql
4. Paste and click "Run"
5. Wait for "Success" message
```

### 2️⃣ Storage Bucket (1 min)
```
1. Open: https://supabase.com/dashboard/project/bqlvprmmtmobobyygnba/storage/buckets
2. Click "New Bucket"
3. Name: portfolio-media
4. Check "Public bucket" ✅
5. Click "Create Bucket"
```

### 3️⃣ Admin User (2 min)
```
1. Open: https://supabase.com/dashboard/project/bqlvprmmtmobobyygnba/auth/users
2. Click "Add User"
3. Email: your-email@example.com
4. Password: (your password)
5. Check "Auto Confirm User" ✅
6. Click "Create User"
7. COPY THE USER ID

8. Open: https://supabase.com/dashboard/project/bqlvprmmtmobobyygnba/editor
9. Click "users" table
10. Click "Insert row"
11. Paste User ID, email, name, role: admin
12. Click "Save"
```

---

## 🎯 Start Development

```bash
# Stop current build (if running)
Ctrl+C

# Start dev server
npm run dev
```

**Open in browser:**
- Visitor site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `supabase-setup.sql` | Run this in Supabase SQL Editor |
| `SETUP_INSTRUCTIONS.md` | Detailed setup guide |
| `STORAGE_BUCKET_SETUP.md` | Storage bucket guide |
| `.env` | ✅ Already configured! |

---

## ✅ Verification Checklist

After setup, verify:
- [ ] 6 tables created in Supabase
- [ ] `portfolio-media` bucket exists and is Public
- [ ] Admin user exists in Authentication
- [ ] Admin user in `users` table with role='admin'
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 shows dark-themed website
- [ ] http://localhost:3000/admin/login shows login page
- [ ] Can login and see admin dashboard

---

## 🆘 Quick Fixes

**Build taking too long?**
```bash
Ctrl+C
npm run dev
```

**Can't login?**
- Check user exists in Auth → Users
- Verify role='admin' in users table
- Try password reset

**Tables not found?**
- Run `supabase-setup.sql` in SQL Editor

**Upload fails?**
- Create `portfolio-media` bucket
- Set to Public

---

## 📞 Need Help?

1. Check `SETUP_INSTRUCTIONS.md` for detailed steps
2. Check `TROUBLESHOOTING.md` for common issues
3. Check Supabase logs in Dashboard

---

**Ready? Start with Step 1️⃣ above! 🚀**

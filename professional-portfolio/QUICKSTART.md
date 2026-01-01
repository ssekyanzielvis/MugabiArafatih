# Quick Start Guide - Updated Portfolio System

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy your existing `.env.local` file or create one with your Supabase credentials.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Visitor Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

## 🎨 Using the New Theme System

### Admin Settings
1. Log in to admin panel
2. Navigate to **Settings** in the sidebar
3. **Color Mode**: Choose Dark (black bg, white text) or Light (white bg, black text)
4. **Font Family**: Select from 6 professional fonts
5. **Preview**: See changes live
6. **Save**: Click "Save Changes" to persist

### Theme Persistence
- Settings are saved to browser localStorage
- Preferences persist across sessions
- Visitor site uses theme settings automatically

## 🎯 New Features Overview

### Toast Notifications
User actions now show feedback notifications:
- ✅ Success (green check): Action completed
- ❌ Error (red alert): Action failed
- ℹ️ Info (blue info): General information

### Enhanced Forms
- Real-time validation
- Clear error messages
- Loading states during submission
- Accessibility improvements

### Responsive Design
- Mobile-first approach
- Touch-friendly navigation
- Optimized for all screen sizes
- Professional appearance everywhere

## 📁 Key Files to Know

### Theme Configuration
- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/app/globals.css` - Theme variables and styles

### Admin Interface
- `src/app/admin/(authenticated)/settings/page.tsx` - Theme settings
- `src/components/admin/Sidebar.tsx` - Navigation

### Visitor Interface
- `src/components/visitor/Header.tsx` - Navigation
- `src/components/visitor/ContactForm.tsx` - Contact form
- `src/components/visitor/HeroSection.tsx` - Homepage hero

### UI Components
- `src/components/ui/toaster.tsx` - Toast notifications
- `src/components/ui/button.tsx` - Button variants
- `src/components/ui/card.tsx` - Card components
- `src/components/ui/input.tsx` - Input fields

## 🎨 Using Theme-Aware Components

### In Admin Pages
```tsx
<div className="admin-card">
  <h2 className="text-2xl font-bold">Title</h2>
  <button className="admin-button">Click Me</button>
</div>
```

### In Visitor Pages
```tsx
<div className="visitor-card">
  <h2 className="text-2xl font-bold">Title</h2>
  <button className="visitor-button">Click Me</button>
</div>
```

### Using the Theme Hook
```tsx
import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { config, updateColorMode } = useTheme()
  
  return (
    <div>
      Current mode: {config.colorMode}
      <button onClick={() => updateColorMode('light')}>
        Switch to Light
      </button>
    </div>
  )
}
```

### Showing Toast Notifications
```tsx
import { showToast } from '@/components/ui/toaster'

function MyComponent() {
  const handleSave = async () => {
    try {
      // Your save logic
      showToast('success', 'Saved successfully!')
    } catch (error) {
      showToast('error', 'Failed to save')
    }
  }
  
  return <button onClick={handleSave}>Save</button>
}
```

## 🎨 CSS Variables Reference

### Using in Components
```tsx
<div style={{ 
  backgroundColor: 'var(--theme-bg)',
  color: 'var(--theme-fg)',
  borderColor: 'var(--theme-fg)'
}}>
  Content
</div>
```

### Available Variables
- `--theme-bg` - Main background color
- `--theme-fg` - Main foreground (text) color
- `--theme-font` - Current font family
- `--admin-bg` - Admin background
- `--admin-fg` - Admin foreground
- `--admin-border` - Admin border color

## 📱 Responsive Breakpoints

### Tailwind Breakpoints Used
- **sm**: 640px (small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)

### Example Usage
```tsx
<div className="text-base md:text-lg lg:text-xl">
  Responsive text size
</div>
```

## ✅ Testing Checklist

Before deployment, verify:
- [ ] Theme switching works (dark/light)
- [ ] Font selection updates correctly
- [ ] Forms submit successfully
- [ ] Toast notifications appear
- [ ] Mobile navigation works
- [ ] All pages are responsive
- [ ] Images load correctly
- [ ] No console errors

## 🐛 Troubleshooting

### Theme Not Changing
1. Check browser console for errors
2. Clear browser cache
3. Clear localStorage: `localStorage.clear()`
4. Refresh the page

### Toast Not Showing
1. Ensure `<Toaster />` is in root layout
2. Check for JavaScript errors
3. Verify `showToast()` is imported correctly

### Styles Not Applying
1. Check CSS class names (admin- or visitor- prefix)
2. Verify CSS variables are defined
3. Inspect element in browser DevTools
4. Check Tailwind classes are correct

## 📚 Additional Resources

- **Full Documentation**: [UI_IMPROVEMENTS.md](./UI_IMPROVEMENTS.md)
- **System Summary**: [SYSTEM_SUMMARY.md](./SYSTEM_SUMMARY.md)
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## 🎯 Common Tasks

### Add a New Admin Page
```tsx
// src/app/admin/(authenticated)/mypage/page.tsx
export default function MyPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold uppercase">My Page</h1>
      <div className="admin-card p-6">
        Content here
      </div>
    </div>
  )
}
```

### Add a New Visitor Page
```tsx
// src/app/(visitor)/mypage/page.tsx
export default function MyPage() {
  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold uppercase">My Page</h1>
      <div className="visitor-card">
        Content here
      </div>
    </div>
  )
}
```

### Add Toast Notification to Form
```tsx
'use client'

import { showToast } from '@/components/ui/toaster'

function MyForm() {
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Submit logic
      showToast('success', 'Form submitted!')
    } catch (error) {
      showToast('error', 'Submission failed')
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

## 🎉 You're All Set!

Your portfolio is now equipped with:
- Professional black & white theme
- Admin-controlled appearance
- Toast notifications
- Responsive design
- Enhanced accessibility
- Better error handling

**Happy coding!** 🚀

---

*Need help? Check the documentation files or reach out to your development team.*

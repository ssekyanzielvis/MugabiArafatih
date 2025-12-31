# Supabase Storage Bucket Setup Guide

## IMPORTANT: Storage buckets CANNOT be created via SQL
You must create storage buckets through the Supabase Dashboard UI.

## Step-by-Step Instructions

### 1. Access Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your account
3. Select your project: **professional-portfolio**

### 2. Navigate to Storage
1. Click on **Storage** in the left sidebar
2. You'll see the Storage Buckets page

### 3. Create Portfolio Media Bucket

#### Click "New Bucket"
- **Name**: `portfolio-media`
- **Public bucket**: ✅ **YES** (Check this box)
- **File size limit**: 10 MB (optional, recommended)
- **Allowed MIME types**: Leave empty for all types, or specify:
  - `image/jpeg`
  - `image/png`
  - `image/gif`
  - `image/webp`
  - `video/mp4`
  - `video/webm`

#### Click "Create Bucket"

### 4. Configure Bucket Policies (Automatic)

When you create a public bucket, Supabase automatically creates these policies:
- ✅ Anyone can view files
- ✅ Authenticated users can upload files
- ✅ Authenticated users can delete their own files

### 5. Verify Bucket Creation

After creating the bucket, you should see:
- Bucket name: `portfolio-media`
- Status: Public
- Files: 0 (initially empty)

### 6. Test Upload (Optional)

1. Click on the `portfolio-media` bucket
2. Click "Upload file"
3. Select a test image
4. After upload, click on the file
5. Copy the public URL
6. Paste URL in browser to verify it's accessible

## Bucket Structure

Your files will be organized as:
```
portfolio-media/
├── media/
│   ├── {random-id}-{timestamp}.jpg
│   ├── {random-id}-{timestamp}.png
│   └── {random-id}-{timestamp}.mp4
```

## URL Format

Public URLs will look like:
```
https://{project-id}.supabase.co/storage/v1/object/public/portfolio-media/media/filename.jpg
```

## Security Notes

✅ **Public Bucket** = Anyone can VIEW files
✅ **RLS Policies** = Only authenticated admins can UPLOAD/DELETE
✅ **File Validation** = Client-side checks for file type and size

## Troubleshooting

### Issue: "Bucket already exists"
**Solution**: The bucket name must be unique. Try `portfolio-media-v2` or similar.

### Issue: "Files not accessible"
**Solution**: 
1. Verify bucket is set to **Public**
2. Check the public URL format
3. Ensure no CORS issues

### Issue: "Upload fails"
**Solution**:
1. Check file size (max 10MB)
2. Verify user is authenticated
3. Check file type is allowed

## Alternative: SQL for Bucket Policies (Advanced)

If you need custom policies, you can run this SQL AFTER creating the bucket:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

-- Allow users to delete their own uploads
CREATE POLICY "User Delete Own"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-media' AND auth.uid() = owner);
```

## Summary Checklist

- [ ] Logged into Supabase Dashboard
- [ ] Navigated to Storage section
- [ ] Created bucket named `portfolio-media`
- [ ] Set bucket to **Public**
- [ ] Verified bucket appears in list
- [ ] (Optional) Tested file upload
- [ ] (Optional) Verified public URL works

## Next Steps

After creating the storage bucket:
1. Update your `.env.local` file with Supabase credentials
2. Run the database setup SQL (`supabase-setup.sql`)
3. Create your first admin user
4. Start the development server: `npm run dev`
5. Test file upload in admin dashboard

---

**Need Help?**
- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- Video Tutorial: https://www.youtube.com/watch?v=J9mTPY8rIXE

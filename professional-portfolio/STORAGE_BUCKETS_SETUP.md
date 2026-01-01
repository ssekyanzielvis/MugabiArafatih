# Supabase Storage Buckets Setup

## Overview
This project uses **separate storage buckets** for each section to organize media files properly.

## Required Storage Buckets

### 1. home-media
- **Purpose**: Store images and videos for the Home page
- **Public Access**: Yes
- **Allowed File Types**: image/*, video/*
- **Max File Size**: 10MB

### 2. kinsmen-media
- **Purpose**: Store images and videos for the Kinsmen page
- **Public Access**: Yes
- **Allowed File Types**: image/*, video/*
- **Max File Size**: 10MB

### 3. collaborate-media
- **Purpose**: Store images and videos for the Collaborate page
- **Public Access**: Yes
- **Allowed File Types**: image/*, video/*
- **Max File Size**: 10MB

## Setup Instructions

### Step 1: Create Buckets in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket** button
4. Create each bucket with the following settings:

#### Create `home-media` bucket:
```
Name: home-media
Public bucket: ✓ (checked)
```

#### Create `kinsmen-media` bucket:
```
Name: kinsmen-media
Public bucket: ✓ (checked)
```

#### Create `collaborate-media` bucket:
```
Name: collaborate-media
Public bucket: ✓ (checked)
```

### Step 2: Set Bucket Policies

Run this SQL in your Supabase SQL Editor:

```sql
-- Policy for home-media bucket
CREATE POLICY "Public read access for home media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'home-media');

CREATE POLICY "Authenticated users can upload home media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'home-media');

CREATE POLICY "Authenticated users can update home media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'home-media');

CREATE POLICY "Authenticated users can delete home media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'home-media');

-- Policy for kinsmen-media bucket
CREATE POLICY "Public read access for kinsmen media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'kinsmen-media');

CREATE POLICY "Authenticated users can upload kinsmen media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kinsmen-media');

CREATE POLICY "Authenticated users can update kinsmen media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'kinsmen-media');

CREATE POLICY "Authenticated users can delete kinsmen media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'kinsmen-media');

-- Policy for collaborate-media bucket
CREATE POLICY "Public read access for collaborate media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'collaborate-media');

CREATE POLICY "Authenticated users can upload collaborate media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'collaborate-media');

CREATE POLICY "Authenticated users can update collaborate media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'collaborate-media');

CREATE POLICY "Authenticated users can delete collaborate media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'collaborate-media');
```

### Step 3: Verify Bucket URLs

After creating buckets, your media URLs will follow this pattern:

```
Home: https://<project-ref>.supabase.co/storage/v1/object/public/home-media/<filename>
Kinsmen: https://<project-ref>.supabase.co/storage/v1/object/public/kinsmen-media/<filename>
Collaborate: https://<project-ref>.supabase.co/storage/v1/object/public/collaborate-media/<filename>
```

## File Naming Convention

Each bucket will store files with this naming convention:
```
<timestamp>.<extension>
```

Example:
```
1704067200.jpg
1704067201.mp4
```

## Testing

1. Go to Admin Dashboard → Content → Select section tab (Home/Kinsmen/Collaborate)
2. Upload a test image
3. Verify it appears in the correct bucket
4. Verify it displays on the visitor page

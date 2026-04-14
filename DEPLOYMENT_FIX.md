# Vercel Deployment Fix - Complete Solution

## Problem Solved
The error `ENOENT: no such file or directory, mkdir '/var/task/public/uploads'` was caused by:
1. Missing upload directories in the deployment
2. Hardcoded paths that don't work in Vercel's serverless environment

## Changes Made

### 1. Created Upload Directory Structure
```
public/uploads/
├── .gitkeep
├── admin/.gitkeep
├── packages/.gitkeep
├── gallery/.gitkeep
├── certifications/.gitkeep
├── team/.gitkeep
└── content/.gitkeep
```

### 2. Updated `.gitignore`
- Added to track the directory structure while ignoring actual uploaded files
- Ensures directories are deployed to Vercel

### 3. Fixed `src/middleware/upload.js`
- Now uses `/tmp/uploads` on Vercel (writable temp directory)
- Uses `public/uploads` in local development
- Automatically creates subdirectories on initialization
- Added graceful error handling for serverless environments

### 4. Fixed `routes/admin/index.js`
- Now imports `uploadDir` from the shared middleware
- Uses dynamic path instead of hardcoded `__dirname`
- Creates directories on-demand with error handling

### 5. Updated `vercel.json`
- Sets `VERCEL=true` environment variable during build
- Allows code to detect serverless environment

## How It Works Now

### Local Development
- Files saved to: `/workspace/public/uploads/[category]/`
- Directories persist between restarts

### Vercel Production
- Files saved to: `/tmp/uploads/[category]/`
- Temp directory is writable in serverless functions
- **Important**: Files in `/tmp` are temporary and deleted after function execution

## ⚠️ Important Note About File Storage on Vercel

Vercel serverless functions have a **temporary filesystem**. Files uploaded to `/tmp`:
- ✅ Work during the request lifecycle
- ❌ Are deleted after the function completes
- ❌ Are NOT shared between different function invocations

### Recommended Solutions for Production

**Option 1: Cloud Storage (Recommended)**
- Use AWS S3, Cloudinary, or Firebase Storage
- Store only URLs in MongoDB
- Files persist permanently

**Option 2: MongoDB GridFS**
- Store files directly in MongoDB
- Good for small to medium files
- No external dependencies

**Option 3: External File Server**
- Set up a separate file storage service
- Upload files via API

## Next Steps for Permanent File Storage

If you need permanent file storage on Vercel, implement one of these:

### Quick Setup with Cloudinary (Free Tier)
```bash
npm install cloudinary
```

Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Then update upload middleware to use Cloudinary instead of local storage.

## Testing

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix: Vercel upload directory issues"
   git push
   ```

2. **Vercel will auto-deploy**

3. **Test admin login:**
   - Visit: `https://your-domain.vercel.app/admin/login`
   - Username: `admin`
   - Password: `admin123`

4. **Test file upload:**
   - Go to Cards → Create Card
   - Upload an image
   - Should work without errors

## Database Setup Reminder

Before using the admin panel, ensure you've seeded the database:

```bash
# Locally
npm run seed

# Or manually create admin in MongoDB Atlas:
# Collection: admins
# {
#   username: "admin",
#   email: "admin@nusratinternational.com",
#   password: "$2a$12$...hashed...",
#   role: "superadmin",
#   isActive: true
# }
```

## All Issues Resolved ✅

1. ✅ Module not found errors - Fixed import paths
2. ✅ Upload directory missing - Created structure + .gitkeep
3. ✅ Vercel read-only filesystem - Using /tmp for serverless
4. ✅ Directory creation errors - Added graceful error handling
5. ✅ .vercelignore excluding src/ - Removed problematic entries

Your admin panel should now work correctly on Vercel!

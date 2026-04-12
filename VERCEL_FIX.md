# Vercel Deployment Fix - MongoDB Connection Issue

## Problem
The application was showing "Database not connected" error even though the environment variable appeared to be set.

## Root Causes Identified
1. **Environment variables in Vercel must be set in the Dashboard**, not in `.env` files (`.env` files are ignored in serverless deployments)
2. **MongoDB IP whitelist** may not include Vercel's server IPs
3. **Connection string format** might be incorrect

## Fixes Applied

### 1. Enhanced Database Connection (`app.js`)
- Added connection promise caching to prevent duplicate connections
- Increased timeout values for slower serverless cold starts
- Added detailed logging for debugging
- Improved error messages with troubleshooting steps

### 2. Better Error Handling (`routes/index.js`)
- Added try-catch blocks around database calls
- More descriptive error logging

### 3. Enhanced Health Check (`/api/health`)
- Returns detailed diagnostic information
- Shows collection list when connected
- Provides troubleshooting steps when failed

## Steps to Fix Your Deployment

### Step 1: Set Environment Variable in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add:
   - **Name**: `MONGODB_URI`
   - **Value**: Your full MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/nusrat_travels?retryWrites=true&w=majority`)
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 2: Configure MongoDB Network Access
1. Go to MongoDB Atlas dashboard
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. For testing, add `0.0.0.0/0` (allows all IPs)
   - For production, add Vercel's IP ranges
5. Click **Confirm**

### Step 3: Verify Connection String Format
Your connection string should look like:
```
mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/nusrat_travels?retryWrites=true&w=majority
```

**Important:** 
- Replace `your-username` and `your-password` with actual credentials
- Ensure special characters in password are URL-encoded
- Include the database name `nusrat_travels`

### Step 4: Redeploy
After making changes:
1. Push your code changes to Git
2. Vercel will automatically redeploy
3. Or manually trigger redeploy from Vercel dashboard

## Testing

### Test Health Endpoint
Visit: `https://your-domain.vercel.app/api/health`

**Success Response:**
```json
{
  "status": "OK",
  "database": "connected",
  "dbName": "nusrat_travels",
  "collections": ["travel_packages", "hajj_packages", "work_packages", "contents"],
  "uriConfigured": true
}
```

**Error Response:**
```json
{
  "status": "ERROR",
  "error": "...",
  "uriConfigured": true,
  "uriLength": 95,
  "troubleshooting": [...]
}
```

### Check Vercel Function Logs
1. Go to Vercel dashboard
2. Click on your deployment
3. Go to **Functions** tab
4. Click on the failed function
5. View logs to see detailed error messages

## Common Issues & Solutions

### Issue: "MONGODB_URI is not configured"
**Solution:** Environment variable not set correctly in Vercel Dashboard

### Issue: "Authentication failed"
**Solution:** 
- Check username/password in connection string
- Ensure password special characters are URL-encoded
- Verify user has read/write permissions on `nusrat_travels` database

### Issue: "getaddrinfo ENOTFOUND" or network timeout
**Solution:**
- MongoDB IP whitelist doesn't include Vercel IPs
- Add `0.0.0.0/0` to Network Access in MongoDB Atlas

### Issue: "Database not found"
**Solution:**
- Database `nusrat_travels` doesn't exist
- Create the database by inserting a test document
- Or update connection string to use existing database name

## Files Modified
- `app.js` - Enhanced database connection logic
- `routes/index.js` - Better error handling in routes

## Next Steps
1. Follow the steps above to configure Vercel and MongoDB
2. Deploy the changes
3. Test `/api/health` endpoint
4. If still failing, check Vercel function logs for detailed error

# Vercel Deployment Guide for Nusrat International

## ✅ Repository is Ready for Vercel

Your repository has been fully configured for Vercel deployment. Follow these steps:

---

## Step 1: Set Up MongoDB Atlas (Required)

Your app needs a MongoDB database to function. 

### Create Database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new cluster (Free M0 tier is sufficient)
4. Create a database user with username and password
5. Configure Network Access:
   - Click "Network Access" → "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click Confirm

### Get Connection String:
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Replace `username` with your database username

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Push code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect the Node.js framework

3. **Configure Environment Variables**
   - In the project settings, click "Environment Variables"
   - Add the following variable:
     - **Name**: `MONGODB_URI`
     - **Value**: Your MongoDB connection string from Step 1
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~1-2 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd /workspace

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? (enter name)
# - Directory? ./
# - Override settings? N

# Add environment variable
vercel env add MONGODB_URI production
# Paste your MongoDB connection string when prompted

# Deploy to production
vercel --prod
```

---

## Step 3: Verify Deployment

1. **Visit your deployed URL**
   - Check if homepage loads correctly
   - Test navigation between pages

2. **Check Function Logs**
   - In Vercel Dashboard → Your Project → Functions
   - View logs to ensure MongoDB connects successfully
   - Look for "MongoDB Connected successfully" message

3. **Test API Endpoints**
   - Visit `https://your-domain.vercel.app/api/travel-packages`
   - Should return JSON data (empty if no data seeded yet)

---

## Step 4: Seed Initial Data (Optional)

Once deployed, you can seed your database:

### Option A: Use the Seed Script Locally
```bash
# Set environment variable
export MONGODB_URI="your-connection-string"

# Run seed script
node seedDatabase.js
```

### Option B: Insert via MongoDB Atlas
1. Go to MongoDB Atlas → Collections
2. Create collections: `travel_packages`, `hajj_packages`, `work_packages`, `contents`
3. Insert documents manually or import JSON

---

## Configuration Files

### vercel.json
Configures serverless functions and routing:
- `app.js` runs as serverless function
- Static assets served from `/public`
- All routes handled by Express app

### .vercelignore
Excludes unnecessary files from deployment:
- Development folders (backend/, server/, react-frontend/)
- Documentation
- Seed scripts
- Environment files

### app.js Updates
- Removed `dotenv` dependency (Vercel handles env vars)
- Added check for missing `MONGODB_URI`
- Server only starts locally (not in Vercel production)

---

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure all dependencies are in package.json
- Verify Node.js version is 18.x

### MongoDB Connection Error
- Verify `MONGODB_URI` is set in Vercel Environment Variables
- Check MongoDB Atlas network access allows 0.0.0.0/0
- Ensure username/password are correct in connection string

### Pages Not Loading
- Check function logs for errors
- Verify routes are properly configured in vercel.json
- Ensure static files exist in `/public` directory

### API Returns Empty Data
- Database might be empty - run seed script
- Check MongoDB connection in function logs
- Verify collection names match your database

---

## Custom Domain (Optional)

To use your own domain:
1. Go to Vercel Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `NODE_ENV` | ❌ No | Auto-set to "production" by Vercel |
| `PORT` | ❌ No | Not needed (Vercel manages ports) |

---

## Support

If you encounter issues:
1. Check Vercel Function Logs
2. Review MongoDB Atlas logs
3. Verify environment variables are set correctly
4. Test locally first: `npm start` with `.env` file

**Your app is now ready to deploy! 🚀**

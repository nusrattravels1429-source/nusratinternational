# Vercel Deployment Guide for Nusrat International

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Vercel CLI** (optional): Install with `npm i -g vercel`

## Step 1: Prepare MongoDB Atlas

1. Create a new cluster (free tier M0 is sufficient)
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for serverless access
4. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nusrat_travels?retryWrites=true&w=majority
   ```

## Step 2: Seed the Database

Before deploying, seed your MongoDB with initial data:

```bash
# Install dependencies
npm install

# Set your MongoDB URI temporarily
export MONGODB_URI="your_connection_string"

# Run the seeder
npm run seed
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `echo 'Vercel build complete'`
   - **Output Directory**: `public`
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
5. Click **Deploy**

### Option B: Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy (in project root)
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? nusrat-international
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add MONGODB_URI production
vercel env add NODE_ENV production

# Deploy to production
vercel --prod
```

## Step 4: Verify Deployment

After deployment:

1. **Check Logs**: View build and runtime logs in Vercel dashboard
2. **Test Endpoints**:
   - Homepage: `https://your-project.vercel.app/`
   - API Health: `https://your-project.vercel.app/api/health`
   - Travel Packages: `https://your-project.vercel.app/api/packages?category=travel`
3. **Test Pages**:
   - `/travel`, `/hajj`, `/work`, `/ticketing`, `/contact`
   - Detail pages: `/travel/:slug`, `/hajj/:slug`, `/work/:slug`

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/nusrat_travels` |
| `NODE_ENV` | Node environment | `production` |

## Important Notes

### Serverless Limitations
- **Function Duration**: Max 10 seconds per request (configured in vercel.json)
- **Database Connections**: Connections are created per invocation; ensure proper connection pooling
- **File Uploads**: Multer is configured but consider using cloud storage (S3, Cloudinary) for production

### Static Assets
- CSS, JS, and images in `/public` are served as static files
- Files are cached with immutable headers for better performance

### EJS Templates
- Views are rendered server-side in Vercel serverless functions
- Ensure all partials and templates are in `/views` directory

## Troubleshooting

### Build Fails
- Check that `package.json` has correct `engines.node` version
- Verify all dependencies are listed in `package.json`

### Database Connection Errors
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Verify connection string format and credentials
- Check that database `nusrat_travels` exists

### 404 on Static Assets
- Verify files exist in `/public` directory
- Check `vercel.json` routes configuration
- Ensure `.vercelignore` doesn't exclude needed files

### Function Timeout
- Optimize database queries with indexes
- Consider caching frequently accessed data
- Reduce maxDuration in `vercel.json` if needed

## Updating Deployment

After initial deployment:

```bash
# Push to Git (if using Git integration)
git push origin main

# Or deploy manually with CLI
vercel --prod
```

## Custom Domain (Optional)

1. Go to Project Settings → Domains in Vercel
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Function Logs**: View in Vercel dashboard → Activity
- **Error Tracking**: Check function logs for runtime errors

## Support

For issues:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

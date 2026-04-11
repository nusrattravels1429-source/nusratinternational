# Deploy Nusrat Travels to Vercel - Step by Step

## ✅ Files Already Created

I've already created/updated these files for you:

1. **`vercel.json`** - Vercel configuration file
2. **`app.js`** - Updated to export module for Vercel compatibility

---

## 📋 STEP-BY-STEP DEPLOYMENT GUIDE

### Step 1: Install Vercel CLI

Open your terminal and run:

```bash
npm install -g vercel
```

If you get permission errors, use:

```bash
sudo npm install -g vercel
```

---

### Step 2: Login to Vercel

```bash
vercel login
```

Choose your login method (GitHub, GitLab, Bitbucket, or Email).

---

### Step 3: Initialize Vercel Project

In your project folder (`/workspace`), run:

```bash
vercel
```

Answer the questions:

1. **Set up and deploy?** → `Y` (Yes)
2. **Which scope?** → Choose your account (press Enter for default)
3. **Link to existing project?** → `N` (No)
4. **What's your project's name?** → `nusrat-travels` (or your preferred name)
5. **In which directory is your code located?** → `./` (current directory)
6. **Want to override the settings?** → `N` (No)

---

### Step 4: Set Environment Variables

Your app needs `MONGODB_URI` to connect to the database.

#### Option A: Set via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click on your project: **nusrat-travels**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add these variables:

| Key | Value | Environments |
|-----|-------|--------------|
| `MONGODB_URI` | Your MongoDB connection string | Production, Preview, Development |

Example MongoDB URI:
```
mongodb+srv://username:password@cluster.mongodb.net/nusrat_travels?retryWrites=true&w=majority
```

6. Click **Save**

#### Option B: Set via CLI

```bash
vercel env add MONGODB_URI production
```

Then paste your MongoDB connection string when prompted.

Repeat for `preview` and `development` if needed.

---

### Step 5: Deploy to Production

Run:

```bash
vercel --prod
```

Vercel will:
- Build your project
- Deploy it to a production URL
- Provide you with a live URL (e.g., `https://nusrat-travels.vercel.app`)

---

### Step 6: Test Your Deployment

1. Open the URL provided by Vercel
2. Test these routes:
   - Homepage: `https://your-app.vercel.app/`
   - Travel packages: `https://your-app.vercel.app/travel`
   - Hajj packages: `https://your-app.vercel.app/hajj`
   - Work packages: `https://your-app.vercel.app/work`

3. **Test the redirect fix:**
   - Try accessing a package by ID: `https://your-app.vercel.app/travel/69d6c4a6cee1c648dfb5a810`
   - It should automatically redirect to: `https://your-app.vercel.app/travel/singapore-domestic-helper`

---

## 🔧 Troubleshooting

### Issue: "Build failed"

**Solution:** Make sure all dependencies are installed:

```bash
npm install
```

Then redeploy:

```bash
vercel --prod
```

---

### Issue: "MongoDB connection error"

**Solution:** 

1. Check your MongoDB URI is correct
2. Ensure MongoDB Atlas allows connections from anywhere:
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
3. Verify username/password in the URI

---

### Issue: "Page not found" for static files

**Solution:** The `public` folder is already configured in `app.js`. If issues persist, verify:

```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

---

## 📝 Quick Reference Commands

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview environment |
| `vercel --prod` | Deploy to production |
| `vercel ls` | List all your deployments |
| `vercel env ls` | List environment variables |
| `vercel env add <KEY>` | Add new environment variable |
| `vercel --remove` | Remove a deployment |

---

## 🎉 Done!

Your app is now live on Vercel with:
- ✅ Automatic slug-based URLs
- ✅ 301 redirects from ObjectId to slug
- ✅ SEO-friendly routing
- ✅ Production-ready configuration

**Next Steps:**
1. Share your live URL with customers
2. Monitor deployments in Vercel dashboard
3. Set up a custom domain (optional) in Vercel Settings

---

## 📚 Additional Resources

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Vercel CLI: https://vercel.com/docs/cli

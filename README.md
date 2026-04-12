# Nusrat International - Travel & Hajj Services

A professional web application for Nusrat International, providing comprehensive travel and Hajj pilgrimage services. Built with Node.js, Express, and MongoDB for dynamic content management.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nusrat-international)

**Before deploying:**
1. Set up MongoDB Atlas (free tier available)
2. Seed your database with initial data
3. Add `MONGODB_URI` environment variable in Vercel

📖 **Full deployment guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🌟 Features

- **Dynamic Content Management**: MongoDB-powered CMS for easy content updates
- **Responsive Design**: Mobile-first approach with modern CSS
- **Multi-language Support**: Bengali and English content
- **Service Pages**: Hajj, Travel, Work Visas, and Ticketing
- **SEO-Friendly**: Slug-based URLs with 301 redirects
- **RESTful API**: Backend API for content operations
- **Serverless Ready**: Optimized for Vercel deployment

## 🏗️ Project Structure

```
nusrat-international/
├── app.js                 # Main server entry point (Vercel-ready)
├── routes/                # Express routes
│   └── index.js          # All route handlers
├── views/                # EJS templates
│   ├── partials/         # Reusable components (header, footer)
│   └── *.ejs            # Page templates
├── public/               # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   └── pages/           # Static HTML pages
├── backend/             # Alternative backend implementations
├── server/              # Mongoose-based server structure
├── react-frontend/      # React SPA alternative
├── docs/                # Documentation
├── vercel.json          # Vercel configuration
├── .vercelignore        # Vercel ignore rules
├── package.json         # Dependencies
└── VERCEL_DEPLOYMENT.md # Detailed deployment guide
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Native Driver)
- **Frontend**: EJS Templates, HTML5, CSS3, Vanilla JavaScript
- **Alternative**: React SPA (in react-frontend/)
- **Deployment**: Vercel Serverless Functions

## 📋 Prerequisites

- Node.js 18.x
- MongoDB Atlas account (free tier OK)
- npm or yarn

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nusrat-international
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nusrat_travels
   PORT=3000
   NODE_ENV=development
   ```

4. **Seed the Database** (optional but recommended)
   ```bash
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the application**
   - Website: http://localhost:3000
   - API: http://localhost:3000/api/health

## 🌐 Deploy to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure:
   - **Build Command**: `echo 'Vercel build complete'`
   - **Output Directory**: `public`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
6. Deploy!

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

📖 **Detailed instructions**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 📚 API Endpoints

### Health Check
```http
GET /api/health
```

### Packages
```http
GET /api/packages                    # Get all packages
GET /api/packages?category=travel    # Filter by category (travel|hajj|work)
GET /api/packages/:slug             # Get specific package by slug
```

### Pages
```http
GET /                               # Homepage
GET /travel                         # Travel packages listing
GET /hajj                           # Hajj packages listing
GET /work                           # Work visa listings
GET /ticketing                      # Ticketing services
GET /contact                        # Contact page
GET /travel/:slug                   # Travel package detail
GET /hajj/:slug                     # Hajj package detail
GET /work/:slug                     # Work package detail
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `NODE_ENV` | Environment (development/production) | ❌ No (default: development) |
| `PORT` | Local development port | ❌ No (default: 3000) |

### MongoDB Collections

- `travel_packages` - International travel packages
- `hajj_packages` - Hajj and Umrah packages
- `work_packages` - Work visa opportunities
- `contents` - CMS content (homepage hero, services, etc.)

## 📁 Key Files

- `app.js` - Main Express server (Vercel-compatible)
- `routes/index.js` - All route handlers
- `vercel.json` - Vercel serverless configuration
- `.vercelignore` - Files to exclude from Vercel deployment
- `seedDatabase.js` - Database seeding script

## 🎨 Static Assets

All static files are served from `/public`:
- CSS: `/css/*.css`
- JavaScript: `/js/*.js`
- Static pages: `/pages/*.html`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is proprietary software for Nusrat International.

## 📞 Support

For deployment issues or questions:
- 📖 Read [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- 📧 Contact: [Your contact email]
- 🌐 Website: [Your website URL]

---

**Built with ❤️ for exceptional travel experiences** 

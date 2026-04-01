# Backend Setup Complete! ✅

## 📁 Project Structure Created

```
/workspace
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── TravelPackage.js      # Travel packages schema
│   │   ├── HajjPackage.js        # Hajj/Umrah packages schema
│   │   ├── WorkPackage.js        # Work visa packages schema
│   │   └── HomepageContent.js    # Homepage dynamic content
│   ├── routes/
│   │   ├── packages.js           # Package CRUD APIs
│   │   ├── homepage.js           # Homepage content API
│   │   └── upload.js             # Image upload API
│   ├── server.js                 # Main Express server
│   └── seeder.js                 # Database seeder script
├── uploads/
│   └── images/                   # Uploaded images storage
├── public/                       # Your existing HTML/CSS/JS
├── .env                          # Environment variables
└── package.json                  # Dependencies & scripts
```

## 🚀 How to Run

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

### 2. Install Dependencies (Already Done)
```bash
npm install
```

### 3. Seed the Database
Load sample data into MongoDB:
```bash
npm run seed
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run at: `http://localhost:5000`

## 📡 API Endpoints Available

### Packages API
- `GET /api/packages/travel` - Get all travel packages
- `GET /api/packages/travel/:slug` - Get single travel package
- `GET /api/packages/hajj` - Get all hajj packages
- `GET /api/packages/hajj/:slug` - Get single hajj package
- `GET /api/packages/work` - Get all work packages
- `GET /api/packages/work/:slug` - Get single work package

**Query Parameters:**
- `?featured=true` - Get only featured packages
- `?limit=5` - Limit number of results
- `?type=hajj` - Filter by type (for hajj)
- `?subType=premium` - Filter by subtype

### Homepage API
- `GET /api/homepage` - Get homepage content
- `PUT /api/homepage` - Update homepage content (admin)

### Upload API
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

### Health Check
- `GET /api/health` - API status check

## 📊 Database Collections

1. **travel_packages** - Tourism packages
2. **hajj_packages** - Hajj & Umrah packages
3. **work_packages** - Work visa packages
4. **homepage_content** - Homepage dynamic sections

## 🔧 Next Steps

Now you need to:

1. **Start MongoDB** on your system
2. **Run the seeder**: `npm run seed`
3. **Start the server**: `npm run dev`
4. **Update your HTML files** to fetch data from these APIs
5. **Create frontend JavaScript** to dynamically render cards

## 📝 Example API Response

```json
// GET /api/packages/travel
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "title": {
        "en": "Tour to Cox's Bazar",
        "bn": "কক্সবাজার ভ্রমণ"
      },
      "slug": "tour-to-coxs-bazar",
      "price": { "amount": 15000, "currency": "BDT" },
      "images": [{ "url": "/images/travel/coxs-bazar.jpg" }],
      "isFeatured": true
    }
  ]
}
```

## 🌐 Access Static Files

Your existing HTML files are served at:
- `http://localhost:5000/index.html`
- `http://localhost:5000/Travel.html`
- `http://localhost:5000/Hajj.html`
- `http://localhost:5000/Work.html`
- etc.

Uploaded images will be available at:
- `http://localhost:5000/uploads/images/filename.jpg`

require('dotenv').config(); // Load .env FIRST before anything else
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { handleMulterError } = require('./src/middleware/upload');

const app = express();
const PORT = process.env.PORT || 3000;

const hasCloudinaryEnv = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryEnv) {
  console.log('☁️  Cloudinary env vars detected; uploads will use cloud storage.');
} else {
  console.warn('⚠️  Cloudinary env vars are missing; uploads will fall back to local disk.');
  if (process.env.VERCEL) {
    console.warn('⚠️  Running on Vercel without Cloudinary can break persistent uploads.');
  }
}

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database connection - optimized for Vercel serverless
let cachedDbClient = null;
let cachedDb = null;
let connectionPromise = null;

async function getDb() {
  // Return cached connection if available
  if (cachedDb) {
    return cachedDb;
  }

  // If a connection is already in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;

  // Check if variable is missing
  if (!uri) {
    console.error('❌ FATAL: MONGODB_URI environment variable is NOT SET');
    console.error('❌ Please add MONGODB_URI to Vercel Environment Variables');
    throw new Error('MONGODB_URI is not configured. Please set it in Vercel dashboard.');
  }

  console.log('✅ MONGODB_URI found (length:', uri.length, ')');
  console.log('🔗 Connecting to MongoDB...');

  // Create connection promise to prevent duplicate connections
  connectionPromise = (async () => {
    try {
      const clientOptions = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true
      };

      const client = new MongoClient(uri, clientOptions);
      await client.connect();

      cachedDbClient = client;
      console.log('✅ MongoDB client connected successfully');

      const db = client.db('nusrat_travels');

      // Verify connection works
      await db.command({ ping: 1 });
      console.log('✅ Database ping successful');

      // List collections to verify access
      const collections = await db.listCollections().toArray();
      console.log('📦 Available collections:', collections.map(c => c.name).join(', ') || 'none');

      cachedDb = db;
      connectionPromise = null; // Clear the promise after successful connection

      return db;
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      console.error('❌ Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      cachedDbClient = null;
      cachedDb = null;
      connectionPromise = null;
      throw err;
    }
  })();

  return connectionPromise;
}

// Make getDb available to routes
app.locals.getDb = getDb;

// Routes
try {
  const routes = require('./routes/index');
  const adminRoutes = require('./routes/admin/index');
  const apiRoutes = require('./routes/api/index');
  app.use('/admin', adminRoutes);
  app.use('/api', apiRoutes);
  app.use('/', routes);
} catch (e) {
  console.error('Route load error:', e.message);
  app.get('/', (req, res) => res.send('Route Error: ' + e.message));
}

// Normalize Multer errors into JSON responses across all upload routes.
app.use(handleMulterError);

// Health check API with detailed diagnostics
app.get('/api/health', async (req, res) => {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    res.json({
      status: 'OK',
      database: 'connected',
      dbName: 'nusrat_travels',
      collections: collections.map(c => c.name),
      uriConfigured: !!process.env.MONGODB_URI
    });
  } catch (err) {
    console.error('❌ Health check failed:', err.message);
    res.status(500).json({
      status: 'ERROR',
      error: err.message,
      errorCode: err.code,
      uriConfigured: !!process.env.MONGODB_URI,
      uriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      troubleshooting: [
        '1. Verify MONGODB_URI is set in Vercel Environment Variables (not .env file)',
        '2. Ensure MongoDB allows connections from Vercel IPs (whitelist 0.0.0.0/0 for testing)',
        '3. Check connection string format: mongodb+srv://user:pass@cluster.mongodb.net/nusrat_travels',
        '4. Verify database "nusrat_travels" exists'
      ]
    });
  }
});

// Final Catch-all 404 handler (must be last)
app.use((req, res) => {
  res.status(404).render('404', {
    url: req.originalUrl,
    pageTitle: '404 - Not Found',
    activePage: '',
    bodyClass: '',
    cssFiles: ['common.css']
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

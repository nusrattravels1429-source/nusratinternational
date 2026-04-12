const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database connection - cached for serverless
let cachedDbClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;

  // Check if variable is missing
  if (!uri) {
    console.error('💥 FATAL: MONGODB_URI environment variable is NOT SET in Vercel.');
    console.error('💥 Go to Vercel Dashboard > Settings > Environment Variables and add MONGODB_URI');
    throw new Error('MONGODB_URI_MISSING');
  }

  console.log('🔍 URI Found. Length:', uri.length);
  console.log('🔍 Attempting connection to MongoDB...');

  try {
    if (!cachedDbClient) {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      cachedDbClient = client;
      console.log('✅ MongoDB client connected');
    }

    const db = cachedDbClient.db('nusrat_travels');
    
    // Test connection
    await db.command({ ping: 1 });
    
    cachedDb = db;
    console.log('✅ SUCCESS: Connected to MongoDB "nusrat_travels"');

    // Verify collections exist
    const cols = await db.listCollections().toArray();
    console.log('📂 Collections found:', cols.map(c => c.name).join(', '));

    if (cols.length === 0) {
      console.warn('⚠️ WARNING: Database is empty! No collections found.');
    }

    return db;
  } catch (err) {
    console.error('💥 FATAL CONNECTION ERROR:', err.message);
    console.error('💥 Full Detail:', err);
    cachedDbClient = null;
    cachedDb = null;
    throw err;
  }
}

// Make getDb available to routes
app.locals.getDb = getDb;

// Routes
try {
  const routes = require('./routes/index');
  app.use('/', routes);
} catch (e) {
  console.error('Route load error:', e.message);
  app.get('/', (req, res) => res.send('Route Error: ' + e.message));
}

// Health check API
app.get('/api/health', async (req, res) => {
  try {
    const db = await getDb();
    res.json({ status: 'OK', database: 'connected' });
  } catch (err) {
    res.status(500).json({ 
      status: 'ERROR', 
      error: err.message,
      uriConfigured: !!process.env.MONGODB_URI 
    });
  }
});

module.exports = app;

/**
 * Nusrat Travels - Node.js/Express Server
 * Travel agency system with MongoDB native driver
 */

require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB Connection
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('nusrat_travels');
    app.locals.db = db;
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Server will continue without database connection. API endpoints will return empty data.');
  }
};

// Connect to database
connectDB();

// Import routes
const routes = require('./routes/index');
app.use('/', routes);

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Nusrat Travels API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all packages
app.get('/api/packages', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.json([]);
    }

    const { category, featured } = req.query;
    const query = { isActive: true };
    if (featured === 'true') query.featured = true;

    let packages = [];
    const sort = { createdAt: -1 };

    if (category === 'travel') {
      packages = await db.collection('travel_packages').find(query).sort(sort).toArray();
    } else if (category === 'hajj') {
      packages = await db.collection('hajj_packages').find(query).sort(sort).toArray();
    } else if (category === 'work') {
      packages = await db.collection('work_packages').find(query).sort(sort).toArray();
    } else {
      const travel = await db.collection('travel_packages').find(query).sort(sort).toArray();
      const hajj = await db.collection('hajj_packages').find(query).sort(sort).toArray();
      const work = await db.collection('work_packages').find(query).sort(sort).toArray();
      packages = [...travel, ...hajj, ...work];
    }

    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get package by slug
app.get('/api/packages/:slug', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(404).json({ error: 'Package not found' });
    }

    let pkg = await db.collection('travel_packages').findOne({ slug: req.params.slug, isActive: true });
    if (!pkg) pkg = await db.collection('hajj_packages').findOne({ slug: req.params.slug, isActive: true });
    if (!pkg) pkg = await db.collection('work_packages').findOne({ slug: req.params.slug, isActive: true });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Nusrat Travels server running on port ${PORT}`);
});
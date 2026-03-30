/**
 * Nusrat International - Node.js/Express Server
 * Professional implementation with MongoDB integration
 * Handles dynamic content management for travel and Hajj services
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// MongoDB Schemas
const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  metaDescription: { type: String },
  isActive: { type: Boolean, default: true },
  sections: [{
    sectionId: { type: String, required: true },
    sectionType: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    content: { type: mongoose.Schema.Types.Mixed }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Page = mongoose.model('Page', pageSchema);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Nusrat International API is running',
    timestamp: new Date().toISOString()
  });
});

// Get page content by slug
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isActive: true });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all active pages
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Page.find({ isActive: true }).select('slug title metaDescription');
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update page (admin functionality)
app.post('/api/pages', async (req, res) => {
  try {
    const { slug, ...updateData } = req.body;
    const page = await Page.findOneAndUpdate(
      { slug },
      { ...updateData, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(page);
  } catch (error) {
    console.error('Error saving page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve HTML files with dynamic content
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/index.html'));
});

// Catch-all handler for HTML pages
app.get('/:page', (req, res) => {
  const pageName = req.params.page;
  const htmlFile = path.join(__dirname, `../public/pages/${pageName}.html`);

  // Check if file exists
  if (require('fs').existsSync(htmlFile)) {
    res.sendFile(htmlFile);
  } else {
    res.status(404).sendFile(path.join(__dirname, '../public/pages/404.html')); // You can create a 404 page
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nusrat International Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Website available at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
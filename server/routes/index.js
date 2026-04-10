const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// GET / - Homepage with all packages
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Fetch packages from MongoDB using native driver
    const travelPackages = await db.collection('packages').find({ category: 'travel', isFeatured: true }).limit(6).toArray();
    const hajjPackages = await db.collection('packages').find({ category: { $in: ['hajj', 'umrah'] }, isFeatured: true }).limit(6).toArray();
    const workPackages = await db.collection('packages').find({ category: 'work', isFeatured: true }).limit(6).toArray();
    
    // Fetch homepage content
    const homepageContent = await db.collection('homepage_content').findOne({});
    
    res.render('index', {
      travelPackages,
      hajjPackages,
      workPackages,
      homepageContent,
      activePage: 'home'
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    // Fallback with empty arrays
    res.render('index', {
      travelPackages: [],
      hajjPackages: [],
      workPackages: [],
      homepageContent: null,
      activePage: 'home'
    });
  }
});

// GET /travel - All travel packages
router.get('/travel', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const packages = await db.collection('packages').find({ category: 'travel' }).toArray();
    res.render('travel', { packages, activePage: 'travel' });
  } catch (error) {
    console.error('Error loading travel packages:', error);
    res.render('travel', { packages: [], activePage: 'travel' });
  }
});

// GET /hajj - All Hajj & Umrah packages
router.get('/hajj', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const packages = await db.collection('packages').find({ category: { $in: ['hajj', 'umrah'] } }).toArray();
    res.render('hajj', { packages, activePage: 'hajj' });
  } catch (error) {
    console.error('Error loading hajj packages:', error);
    res.render('hajj', { packages: [], activePage: 'hajj' });
  }
});

// GET /work - All work opportunities
router.get('/work', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const packages = await db.collection('packages').find({ category: 'work' }).toArray();
    res.render('work', { packages, activePage: 'work' });
  } catch (error) {
    console.error('Error loading work packages:', error);
    res.render('work', { packages: [], activePage: 'work' });
  }
});

// GET /travel/:slug - Travel package details
router.get('/travel/:slug', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { slug } = req.params;
    
    // Try to find by slug first
    let pkg = await db.collection('packages').findOne({ slug: slug, category: 'travel' });
    
    // If not found, try by ObjectId
    if (!pkg && ObjectId.isValid(slug)) {
      pkg = await db.collection('packages').findOne({ _id: new ObjectId(slug), category: 'travel' });
    }
    
    res.render('travel-detail', { pkg, activePage: 'travel' });
  } catch (error) {
    console.error('Error loading travel package:', error);
    res.render('travel-detail', { pkg: null, activePage: 'travel' });
  }
});

// GET /hajj/:slug - Hajj/Umrah package details
router.get('/hajj/:slug', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { slug } = req.params;
    
    // Try to find by slug first
    let pkg = await db.collection('packages').findOne({ 
      slug: slug, 
      category: { $in: ['hajj', 'umrah'] } 
    });
    
    // If not found, try by ObjectId
    if (!pkg && ObjectId.isValid(slug)) {
      pkg = await db.collection('packages').findOne({ 
        _id: new ObjectId(slug), 
        category: { $in: ['hajj', 'umrah'] } 
      });
    }
    
    res.render('hajj-detail', { pkg, activePage: 'hajj' });
  } catch (error) {
    console.error('Error loading hajj package:', error);
    res.render('hajj-detail', { pkg: null, activePage: 'hajj' });
  }
});

// GET /work/:slug - Work opportunity details
router.get('/work/:slug', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { slug } = req.params;
    
    // Try to find by slug first
    let pkg = await db.collection('packages').findOne({ slug: slug, category: 'work' });
    
    // If not found, try by ObjectId
    if (!pkg && ObjectId.isValid(slug)) {
      pkg = await db.collection('packages').findOne({ _id: new ObjectId(slug), category: 'work' });
    }
    
    res.render('work-detail', { pkg, activePage: 'work' });
  } catch (error) {
    console.error('Error loading work package:', error);
    res.render('work-detail', { pkg: null, activePage: 'work' });
  }
});

module.exports = router;

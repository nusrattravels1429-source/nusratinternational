const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Helper function to generate slug from title
function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
}

// Helper function to transform package data for frontend
function transformPackage(pkg) {
  if (!pkg) return null;
  
  // Handle location based on package type
  let location = '';
  if (pkg.company?.location?.city) {
    location = `${pkg.company.location.city}, ${pkg.company.location.country}`;
  } else if (pkg.location) {
    location = pkg.location;
  }
  
  return {
    _id: pkg._id,
    title_en: pkg.title?.en || pkg.jobTitle?.en || '',
    title_bn: pkg.title?.bn || pkg.jobTitle?.bn || '',
    slug: pkg.slug,
    category: pkg.category,
    desc_en: pkg.shortDescription?.en || '',
    desc_bn: pkg.shortDescription?.bn || '',
    image: pkg.images?.[0]?.url || '',
    images: pkg.images || [],
    price: pkg.price?.amount || pkg.salary?.min || 0,
    currency: pkg.price?.currency || pkg.salary?.currency || 'BDT',
    duration: pkg.duration?.days ? `${pkg.duration.days} Days` : '',
    rating: pkg.rating || 0,
    location: location,
    isFeatured: pkg.isFeatured,
    isActive: pkg.isActive,
    // Include all original data for detail pages
    ...pkg
  };
}

// Generic GET handler with category query parameter
// GET /api/packages?category=travel|hajj|work
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const db = req.app.locals.db;
    
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category parameter is required' });
    }

    let query = { isActive: true };

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Adjust query based on category
    if (category === 'travel') {
      query.category = 'travel';
    } else if (category === 'hajj') {
      query.category = { $in: ['hajj', 'umrah'] };
    } else if (category === 'work') {
      query.category = 'work';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    let packagesQuery = db.collection('packages').find(query).sort({ createdAt: -1 });
    
    if (limit) {
      packagesQuery = packagesQuery.limit(parseInt(limit));
    }

    const packages = await packagesQuery.toArray();
    
    // Transform packages for frontend
    const transformedPackages = packages.map(transformPackage);
    res.json(transformedPackages);
  } catch (error) {
    console.error('Error loading packages:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get all travel packages
router.get('/travel', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { featured, limit } = req.query;
    let query = { category: 'travel', isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    let packagesQuery = db.collection('packages').find(query).sort({ createdAt: -1 });
    
    if (limit) {
      packagesQuery = packagesQuery.limit(parseInt(limit));
    }
    
    const packages = await packagesQuery.toArray();
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    console.error('Error loading travel packages:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get single travel package by slug or ID
// If accessed via ObjectId, redirects to slug-based URL (301)
router.get('/travel/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    let pkg = null;
    
    // Step 1: Try to find by slug first
    pkg = await db.collection('packages').findOne({ slug: id, category: 'travel', isActive: true });
    
    // Step 2: If not found by slug, check if param is valid ObjectId
    if (!pkg && ObjectId.isValid(id)) {
      // Step 3: Find package by _id
      pkg = await db.collection('packages').findOne({ _id: new ObjectId(id), category: 'travel', isActive: true });
      
      // Step 4: If found via ObjectId, redirect to slug URL (301 permanent redirect)
      if (pkg) {
        return res.redirect(301, `/travel/${pkg.slug}`);
      }
    }
    
    // If still not found, return 404
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    // Found by slug - return the package data
    res.json({ success: true, data: transformPackage(pkg) });
  } catch (error) {
    console.error('Error loading travel package:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get all hajj packages
router.get('/hajj', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { featured, type, limit } = req.query;
    let query = { category: { $in: ['hajj', 'umrah'] }, isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (type) {
      query.packageType = type;
    }
    
    let packagesQuery = db.collection('packages').find(query).sort({ createdAt: -1 });
    
    if (limit) {
      packagesQuery = packagesQuery.limit(parseInt(limit));
    }
    
    const packages = await packagesQuery.toArray();
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    console.error('Error loading hajj packages:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get single hajj package by slug or ID
// If accessed via ObjectId, redirects to slug-based URL (301)
router.get('/hajj/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    let pkg = null;
    
    // Step 1: Try to find by slug first
    pkg = await db.collection('packages').findOne({ 
      slug: id, 
      category: { $in: ['hajj', 'umrah'] },
      isActive: true
    });
    
    // Step 2: If not found by slug, check if param is valid ObjectId
    if (!pkg && ObjectId.isValid(id)) {
      // Step 3: Find package by _id
      pkg = await db.collection('packages').findOne({ 
        _id: new ObjectId(id), 
        category: { $in: ['hajj', 'umrah'] },
        isActive: true
      });
      
      // Step 4: If found via ObjectId, redirect to slug URL (301 permanent redirect)
      if (pkg) {
        return res.redirect(301, `/hajj/${pkg.slug}`);
      }
    }
    
    // If still not found, return 404
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    // Found by slug - return the package data
    res.json({ success: true, data: transformPackage(pkg) });
  } catch (error) {
    console.error('Error loading hajj package:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get all work packages
router.get('/work', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { featured, sector, limit } = req.query;
    let query = { category: 'work', isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (sector) {
      query.sectors = { $in: [sector] };
    }
    
    let packagesQuery = db.collection('packages').find(query).sort({ createdAt: -1 });
    
    if (limit) {
      packagesQuery = packagesQuery.limit(parseInt(limit));
    }
    
    const packages = await packagesQuery.toArray();
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    console.error('Error loading work packages:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get single work package by slug or ID
// If accessed via ObjectId, redirects to slug-based URL (301)
router.get('/work/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    let pkg = null;
    
    // Step 1: Try to find by slug first
    pkg = await db.collection('packages').findOne({ slug: id, category: 'work', isActive: true });
    
    // Step 2: If not found by slug, check if param is valid ObjectId
    if (!pkg && ObjectId.isValid(id)) {
      // Step 3: Find package by _id
      pkg = await db.collection('packages').findOne({ _id: new ObjectId(id), category: 'work', isActive: true });
      
      // Step 4: If found via ObjectId, redirect to slug URL (301 permanent redirect)
      if (pkg) {
        return res.redirect(301, `/work/${pkg.slug}`);
      }
    }
    
    // If still not found, return 404
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    // Found by slug - return the package data
    res.json({ success: true, data: transformPackage(pkg) });
  } catch (error) {
    console.error('Error loading work package:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;

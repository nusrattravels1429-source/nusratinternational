const express = require('express');
const router = express.Router();

// Helper to get DB connection (lazy loading for serverless)
async function getDb(req) {
  const getDbFunc = req.app.locals.getDb;
  if (!getDbFunc) {
    throw new Error('Database getDb function not available. Check app initialization.');
  }
  try {
    return await getDbFunc();
  } catch (err) {
    console.error('❌ Route failed to get DB connection:', err.message);
    throw err;
  }
}

// Homepage route
router.get('/', async (req, res) => {
  try {
    const db = await getDb(req);
    let travelPackages = [];
    let hajjPackages = [];
    let workPackages = [];
    let homepageHero = null;
    let homepageServices = null;
    let homepageCredentials = null;

    // Get packages from different collections
    travelPackages = await db.collection('travel_packages').find({ isActive: true }).sort({ createdAt: -1 }).limit(3).toArray();
    hajjPackages = await db.collection('hajj_packages').find({ isActive: true }).sort({ createdAt: -1 }).limit(3).toArray();
    workPackages = await db.collection('work_packages').find({ isActive: true }).sort({ createdAt: -1 }).limit(3).toArray();

    // Get homepage content
    homepageHero = await db.collection('contents').findOne({ key: 'homepage-hero', isActive: true });
    homepageServices = await db.collection('contents').findOne({ key: 'homepage-services', isActive: true });
    homepageCredentials = await db.collection('contents').findOne({ key: 'homepage-credentials', isActive: true });

    res.render('index', {
      travelPackages,
      hajjPackages,
      workPackages,
      homepageHero,
      homepageServices,
      homepageCredentials,
      activePage: 'home',
      cssFiles: ['common.css', 'sections.css', 'slider_container.css', 'cards.css']
    });
  } catch (error) {
    console.error('Error rendering homepage:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Travel listing
router.get('/travel', async (req, res) => {
  try {
    const db = await getDb(req);
    const packages = await db.collection('travel_packages').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    res.render('travel', { packages, activePage: 'travel', cssFiles: ['Travel.css', 'common.css', 'cards.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering travel page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Hajj listing
router.get('/hajj', async (req, res) => {
  try {
    const db = await getDb(req);
    const packages = await db.collection('hajj_packages').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    res.render('hajj', { packages, activePage: 'hajj', cssFiles: ['Hajj.css', 'common.css', 'cards.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering hajj page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Work listing
router.get('/work', async (req, res) => {
  try {
    const db = await getDb(req);
    const packages = await db.collection('work_packages').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    res.render('work', { packages, activePage: 'work', cssFiles: ['common.css', 'slider_container.css', 'sections.css', 'cards.css', 'work.css'] });
  } catch (error) {
    console.error('Error rendering work page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Ticketing listing
router.get('/ticketing', async (req, res) => {
  try {
    res.render('ticketing', { activePage: 'ticketing', cssFiles: ['common.css', 'traveling.css'] });
  } catch (error) {
    console.error('Error rendering ticketing page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Contact page
router.get('/contact', async (req, res) => {
  try {
    res.render('contact', { activePage: 'contact', cssFiles: ['common.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering contact page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// About page
router.get('/about', async (req, res) => {
  try {
    res.render('about', { activePage: 'about', cssFiles: ['common.css', 'About_us.css'] });
  } catch (error) {
    console.error('Error rendering about page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Gallery page
router.get('/gallery', async (req, res) => {
  try {
    // Optional: Fetch gallery items from database if you have a collection
    // const db = await getDb(req);
    // const galleryItems = await db.collection('gallery').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    res.render('gallery', {
      activePage: 'about',
      cssFiles: ['common.css', 'gallery.css']
      // galleryItems: galleryItems // uncomment if using DB
    });
  } catch (error) {
    console.error('Error rendering gallery page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Employees/Our Team page
router.get('/employees', async (req, res) => {
  try {
    // Optional: Fetch employees from database if you have a collection
    // const db = await getDb(req);
    // const employees = await db.collection('employees').find({ isActive: true }).sort({ order: 1 }).toArray();
    res.render('employees', {
      activePage: 'about',
      cssFiles: ['common.css', 'employees.css']
      // employees: employees // uncomment if using DB
    });
  } catch (error) {
    console.error('Error rendering employees page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Certifications page (also accessible via /about#certifications anchor)
router.get('/certifications', async (req, res) => {
  try {
    res.render('certifications', {
      activePage: 'about',
      cssFiles: ['common.css', 'certifications.css']
    });
  } catch (error) {
    console.error('Error rendering certifications page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Travel detail - accepts both slug and ObjectId, redirects ObjectId to slug
router.get('/travel/:param', async (req, res) => {
  try {
    const db = await getDb(req);
    const { param } = req.params;
    const { ObjectId } = require('mongodb');

    // Step 1: Try to find by slug first
    let pkg = await db.collection('travel_packages').findOne({ slug: param, isActive: true });

    // Step 2: If not found, check if param is valid ObjectId
    if (!pkg && ObjectId.isValid(param)) {
      // Step 3: Find package by _id
      pkg = await db.collection('travel_packages').findOne({ _id: new ObjectId(param), isActive: true });

      // Step 4: If found via ObjectId, redirect to slug URL (301 permanent redirect)
      if (pkg) {
        return res.redirect(301, `/travel/${pkg.slug}`);
      }
    }

    if (!pkg) {
      return res.status(404).render('404', { url: req.originalUrl, pageTitle: '404 - Not Found', activePage: '', bodyClass: '', cssFiles: ['common.css'] });
    }
    res.render('travel-detail', { pkg, activePage: 'travel', cssFiles: ['common.css', 'sections.css', 'Package-detail-travlas.css'], bodyClass: 'theme-travel' });
  } catch (error) {
    console.error('Error rendering travel detail:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Hajj detail - accepts both slug and ObjectId, redirects ObjectId to slug
router.get('/hajj/:param', async (req, res) => {
  try {
    const db = await getDb(req);
    const { param } = req.params;
    const { ObjectId } = require('mongodb');

    // Step 1: Try to find by slug first
    let pkg = await db.collection('hajj_packages').findOne({ slug: param, isActive: true });

    // Step 2: If not found, check if param is valid ObjectId
    if (!pkg && ObjectId.isValid(param)) {
      // Step 3: Find package by _id
      pkg = await db.collection('hajj_packages').findOne({ _id: new ObjectId(param), isActive: true });

      // Step 4: If found via ObjectId, redirect to slug URL (301 permanent redirect)
      if (pkg) {
        return res.redirect(301, `/hajj/${pkg.slug}`);
      }
    }

    if (!pkg) {
      return res.status(404).render('404', { url: req.originalUrl, pageTitle: '404 - Not Found', activePage: '', bodyClass: '', cssFiles: ['common.css'] });
    }
    res.render('hajj-detail', { pkg, activePage: 'hajj', cssFiles: ['common.css', 'sections.css', 'Package-detail-travlas.css'], bodyClass: 'theme-hajj' });
  } catch (error) {
    console.error('Error rendering hajj detail:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Work detail - accepts both slug and ObjectId, redirects ObjectId to slug
router.get('/work/:param', async (req, res) => {
  try {
    const db = await getDb(req);
    const { param } = req.params;
    const { ObjectId } = require('mongodb');

    // Step 1: Try to find by slug first
    let pkg = await db.collection('work_packages').findOne({ slug: param, isActive: true });

    // Step 2: If not found, check if param is valid ObjectId
    if (!pkg && ObjectId.isValid(param)) {
      // Step 3: Find package by _id
      pkg = await db.collection('work_packages').findOne({ _id: new ObjectId(param), isActive: true });

      // Step 4: If found via ObjectId, redirect to slug URL (301 permanent redirect)
      if (pkg) {
        return res.redirect(301, `/work/${pkg.slug}`);
      }
    }

    if (!pkg) {
      return res.status(404).render('404', { url: req.originalUrl, pageTitle: '404 - Not Found', activePage: '', bodyClass: '', cssFiles: ['common.css'] });
    }
    res.render('work-detail', { pkg, activePage: 'work', cssFiles: ['common.css', 'slider_container.css', 'sections.css', 'cards.css', 'contact.css', 'package-detail-work.css'], bodyClass: 'theme-work' });
  } catch (error) {
    console.error('Error rendering work detail:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Note: Catch-all 404 handler removed from here and moved to app.js 
// to ensure it doesn't block other routers like /admin or /api.

module.exports = router;
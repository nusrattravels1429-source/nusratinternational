const express = require('express');
const router = express.Router();

// Homepage route
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    let travelPackages = [];
    let hajjPackages = [];
    let workPackages = [];
    let homepageHero = null;
    let homepageServices = null;
    let homepageCredentials = null;

    if (db) {
      // Get packages from different collections
      travelPackages = await db.collection('travel_packages').find({ isActive: true }).sort({ createdAt: -1 }).limit(3).toArray();
      hajjPackages = await db.collection('hajj_packages').find({ isActive: true }).sort({ createdAt: -1 }).limit(3).toArray();
      workPackages = await db.collection('work_packages').find({ isActive: true }).sort({ createdAt: -1 }).limit(3).toArray();

      // Get homepage content
      homepageHero = await db.collection('contents').findOne({ key: 'homepage-hero', isActive: true });
      homepageServices = await db.collection('contents').findOne({ key: 'homepage-services', isActive: true });
      homepageCredentials = await db.collection('contents').findOne({ key: 'homepage-credentials', isActive: true });
    }

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
    res.status(500).send('Internal Server Error');
  }
});

// Travel listing
router.get('/travel', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const packages = await db.collection('travel_packages').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    res.render('travel', { packages, activePage: 'travel', cssFiles: ['Travel.css', 'common.css', 'cards.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering travel page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Hajj listing
router.get('/hajj', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const packages = await db.collection('hajj_packages').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    res.render('hajj', { packages, activePage: 'hajj', cssFiles: ['Hajj.css', 'common.css', 'cards.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering hajj page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Work listing
router.get('/work', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const packages = await db.collection('work_packages').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    res.render('work', { packages, activePage: 'work', cssFiles: ['common.css', 'slider_container.css', 'sections.css', 'cards.css', 'work.css'] });
  } catch (error) {
    console.error('Error rendering work page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Ticketing listing
router.get('/ticketing', async (req, res) => {
  try {
    res.render('ticketing', { activePage: 'ticketing', cssFiles: ['common.css', 'traveling.css'] });
  } catch (error) {
    console.error('Error rendering ticketing page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Contact page
router.get('/contact', async (req, res) => {
  try {
    res.render('contact', { activePage: 'contact', cssFiles: ['common.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering contact page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Travel detail - accepts both slug and ObjectId, redirects ObjectId to slug
router.get('/travel/:param', async (req, res) => {
  try {
    const db = req.app.locals.db;
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
    res.status(500).send('Internal Server Error');
  }
});

// Hajj detail - accepts both slug and ObjectId, redirects ObjectId to slug
router.get('/hajj/:param', async (req, res) => {
  try {
    const db = req.app.locals.db;
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
    res.status(500).send('Internal Server Error');
  }
});

// Work detail - accepts both slug and ObjectId, redirects ObjectId to slug
router.get('/work/:param', async (req, res) => {
  try {
    const db = req.app.locals.db;
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
    res.status(500).send('Internal Server Error');
  }
});

// Catch-all 404 handler
router.use((req, res) => {
  res.status(404).render('404', { 
    url: req.originalUrl, 
    pageTitle: '404 - Not Found', 
    activePage: '', 
    bodyClass: '', 
    cssFiles: ['common.css'] 
  });
});

module.exports = router;
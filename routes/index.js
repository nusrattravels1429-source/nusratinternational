const express = require('express');
const router = express.Router();

async function getDb(req) {
  return await req.app.locals.getDb();
}

// =============================================================================
// HOMEPAGE
// =============================================================================
router.get('/', async (req, res) => {
  try {
    const db = await getDb(req);

    const [slider, ticketing, certifications, travelPackages, hajjPackages, workPackages] = await Promise.all([
      db.collection('sitecontents').find({ section: 'homepage', key: { $regex: /^hero-/ } }).sort({ 'metadata.order': 1 }).toArray(),
      db.collection('sitecontents').findOne({ section: 'ticketing', key: 'ticketing-intro' }),
      db.collection('certifications').find({ isActive: true }).sort({ order: 1, isFeatured: -1 }).toArray(),
      db.collection('cards').find({ type: 'travel', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).limit(6).toArray(),
      db.collection('cards').find({ type: 'hajj', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).limit(6).toArray(),
      db.collection('cards').find({ type: 'work', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).limit(6).toArray()
    ]);

    res.render('index', {
      travelPackages,
      hajjPackages,
      workPackages,
      homepageHero: slider.length > 0 ? slider[0] : null,
      sliderSlides: slider,
      ticketingContent: ticketing,
      certifications,
      activePage: 'home',
      cssFiles: ['common.css', 'sections.css', 'slider_container.css', 'cards.css']
    });
  } catch (error) {
    console.error('Error rendering homepage:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// TRAVEL
// =============================================================================
router.get('/travel', async (req, res) => {
  try {
    const db = await getDb(req);
    const [packages, content] = await Promise.all([
      db.collection('cards').find({ type: 'travel', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).toArray(),
      db.collection('sitecontents').findOne({ section: 'travel', key: 'travel-page-intro' })
    ]);
    res.render('travel', { packages, pageContent: content, activePage: 'travel', cssFiles: ['Travel.css', 'common.css', 'cards.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering travel page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// HAJJ
// =============================================================================
router.get('/hajj', async (req, res) => {
  try {
    const db = await getDb(req);
    const [packages, content] = await Promise.all([
      db.collection('cards').find({ type: 'hajj', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).toArray(),
      db.collection('sitecontents').findOne({ section: 'hajj', key: 'hajj-page-intro' })
    ]);
    res.render('hajj', { packages, pageContent: content, activePage: 'hajj', cssFiles: ['Hajj.css', 'common.css', 'cards.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering hajj page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// WORK
// =============================================================================
router.get('/work', async (req, res) => {
  try {
    const db = await getDb(req);
    const [packages, content] = await Promise.all([
      db.collection('cards').find({ type: 'work', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).toArray(),
      db.collection('sitecontents').findOne({ section: 'work', key: 'work-page-intro' })
    ]);
    res.render('work', { packages, pageContent: content, activePage: 'work', cssFiles: ['common.css', 'slider_container.css', 'sections.css', 'cards.css', 'work.css'] });
  } catch (error) {
    console.error('Error rendering work page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// TICKETING
// =============================================================================
router.get('/ticketing', async (req, res) => {
  try {
    const db = await getDb(req);
    const content = await db.collection('sitecontents').findOne({ section: 'ticketing', key: 'ticketing-page' });
    res.render('ticketing', { pageContent: content, activePage: 'ticketing', cssFiles: ['common.css', 'traveling.css'] });
  } catch (error) {
    console.error('Error rendering ticketing page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// CONTACT
// =============================================================================
router.get('/contact', async (req, res) => {
  try {
    const db = await getDb(req);
    const content = await db.collection('sitecontents').findOne({ section: 'contact', key: 'contact-info' });
    res.render('contact', { pageContent: content, activePage: 'contact', cssFiles: ['common.css', 'contact.css'] });
  } catch (error) {
    console.error('Error rendering contact page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// ABOUT
// =============================================================================
router.get('/about', async (req, res) => {
  try {
    const db = await getDb(req);
    const [aboutContent, founder, teamMembers] = await Promise.all([
      db.collection('sitecontents').findOne({ section: 'about', key: 'about-header' }),
      db.collection('teammembers').findOne({ isFounder: true, isActive: true }),
      db.collection('teammembers').find({ isFounder: { $ne: true }, isActive: true }).sort({ order: 1 }).toArray()
    ]);
    res.render('about', { aboutContent, founder, teamMembers, activePage: 'about', cssFiles: ['common.css', 'About_us.css'] });
  } catch (error) {
    console.error('Error rendering about page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// GALLERY
// =============================================================================
router.get('/gallery', async (req, res) => {
  try {
    const db = await getDb(req);
    const galleryItems = await db.collection('galleryitems').find({ isActive: true }).sort({ order: 1, createdAt: -1 }).toArray();
    res.render('gallery', { galleryItems, activePage: 'about', cssFiles: ['common.css', 'gallery.css'] });
  } catch (error) {
    console.error('Error rendering gallery page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// EMPLOYEES / TEAM
// =============================================================================
router.get('/employees', async (req, res) => {
  try {
    const db = await getDb(req);
    const [founder, employees] = await Promise.all([
      db.collection('teammembers').findOne({ isFounder: true, isActive: true }),
      db.collection('teammembers').find({ isFounder: { $ne: true }, isActive: true }).sort({ order: 1 }).toArray()
    ]);
    res.render('employees', { founder, employees, activePage: 'about', cssFiles: ['common.css', 'employees.css'] });
  } catch (error) {
    console.error('Error rendering employees page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// CERTIFICATIONS
// =============================================================================
router.get('/certifications', async (req, res) => {
  try {
    const db = await getDb(req);
    const certifications = await db.collection('certifications').find({ isActive: true }).sort({ order: 1, isFeatured: -1 }).toArray();
    res.render('certifications', { certifications, activePage: 'about', cssFiles: ['common.css', 'certifications.css'] });
  } catch (error) {
    console.error('Error rendering certifications page:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// =============================================================================
// PACKAGE DETAIL ROUTES
// =============================================================================
const { ObjectId } = require('mongodb');

function buildDetailRoute(collection, view, activePageKey, cssFiles) {
  return async (req, res) => {
    try {
      const db = await getDb(req);
      const { param } = req.params;

      let pkg = await db.collection(collection).findOne({ slug: param, isActive: true });

      if (!pkg && ObjectId.isValid(param)) {
        pkg = await db.collection(collection).findOne({ _id: new ObjectId(param), isActive: true });
        if (pkg) return res.redirect(301, `/${activePageKey}/${pkg.slug}`);
      }

      if (!pkg) {
        return res.status(404).render('404', { url: req.originalUrl, pageTitle: '404 - Not Found', activePage: '', bodyClass: '', cssFiles: ['common.css'] });
      }

      res.render(view, { pkg, activePage: activePageKey, cssFiles, bodyClass: 'theme-' + activePageKey });
    } catch (error) {
      console.error(`Error rendering ${activePageKey} detail:`, error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
  };
}

router.get('/travel/:param', buildDetailRoute('cards', 'travel-detail', 'travel', ['common.css', 'sections.css', 'Package-detail-travlas.css']));
router.get('/hajj/:param', buildDetailRoute('cards', 'hajj-detail', 'hajj', ['common.css', 'sections.css', 'Package-detail-travlas.css']));
router.get('/work/:param', buildDetailRoute('cards', 'work-detail', 'work', ['common.css', 'slider_container.css', 'sections.css', 'cards.css', 'contact.css', 'package-detail-work.css']));

module.exports = router;
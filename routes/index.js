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

    const [slider, heroText, ticketing, certifications, travelPackages, hajjPackages, workPackages] = await Promise.all([
      db.collection('sitecontents').find({ section: 'homepage', key: { $in: ['hero-1', 'hero-2', 'hero-3', 'hero-4'] }, imageUrl: { $ne: '' } }).sort({ order: 1 }).toArray(),
      db.collection('sitecontents').findOne({ section: 'homepage', key: 'homepage-hero-text' }),
      db.collection('sitecontents').findOne({ section: 'ticketing', key: 'ticketing-intro' }),
      db.collection('certifications').find({ isActive: true }).sort({ order: 1, isFeatured: -1 }).toArray(),
      db.collection('cards').find({ type: 'travel', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).limit(6).toArray(),
      db.collection('cards').find({ type: 'hajj', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).limit(6).toArray(),
      db.collection('cards').find({ type: 'work', isActive: true, isPaused: { $ne: true } }).sort({ order: 1, createdAt: -1 }).limit(6).toArray()
    ]);

    res.render('index', {
      pageTitle: 'Nusrat International | Travel, Hajj & Manpower Recruitment',
      metaDescription: 'Official website of Nusrat International. We provide premium International Ticketing, Hajj & Umrah services, and Global Manpower recruitment from Bangladesh.',
      metaKeywords: 'Nusrat International, Travel Agency Bangladesh, Hajj Agency, Umrah Agency, Manpower Recruitment, BAIRA RL-1429, Dhaka Travel Agent',
      activePath: '/',
      travelPackages,
      hajjPackages,
      workPackages,
      homepageHero: heroText,
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
    res.render('travel', { 
      pageTitle: 'International Travel & Tour Packages | Nusrat International',
      metaDescription: 'Explore our latest international travel packages. From group tours to customized holidays, Nusrat International offers the best travel experiences.',
      metaKeywords: 'International Tours, Holiday Packages, Bangladesh Travel Agency, Group Tours, Cheap Flights',
      activePath: '/travel',
      packages, 
      pageContent: content, 
      activePage: 'travel', 
      cssFiles: ['Travel.css', 'common.css', 'cards.css', 'contact.css'] 
    });
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
    res.render('hajj', { 
      pageTitle: 'Premium Hajj & Umrah Packages 2024-2025 | Nusrat International',
      metaDescription: 'Perform your holy pilgrimage with Nusrat International. We offer reliable and premium Hajj and Umrah packages with experienced guides and premium hotels.',
      metaKeywords: 'Hajj Package 2024, Umrah Package Bangladesh, Hajj Agency Dhaka, Islamic Pilgrimage, Cheap Umrah',
      activePath: '/hajj',
      packages, 
      pageContent: content, 
      activePage: 'hajj', 
      cssFiles: ['Hajj.css', 'common.css', 'cards.css', 'contact.css'] 
    });
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
    res.render('work', { 
      pageTitle: 'Global Manpower Recruitment & Work Visas | Nusrat International',
      metaDescription: 'Nusrat International (RL-1429) is a licensed manpower recruitment agency in Bangladesh. Find work visa opportunities in Europe, Middle East, and Asia.',
      metaKeywords: 'Manpower Recruitment Bangladesh, Work Visa Agency, BAIRA RL-1429, Job Abroad, Recruitment Agency Dhaka',
      activePath: '/work',
      packages, 
      pageContent: content, 
      activePage: 'work', 
      cssFiles: ['common.css', 'slider_container.css', 'sections.css', 'cards.css', 'work.css'] 
    });
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
    res.render('ticketing', { 
      pageTitle: 'Air Ticketing & Flight Booking Services | Nusrat International',
      metaDescription: 'Book your international and domestic flights with Nusrat International. We provide the most competitive airfares for all major airlines.',
      metaKeywords: 'Flight Booking Dhaka, Air Ticketing Bangladesh, Cheap Air Tickets, IATA Travel Agency, Flight Reservation',
      activePath: '/ticketing',
      pageContent: content, 
      activePage: 'ticketing', 
      cssFiles: ['common.css', 'traveling.css'] 
    });
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
    res.render('contact', { 
      pageTitle: 'Contact Us | Nusrat International - Dhaka Office',
      metaDescription: 'Get in touch with Nusrat International for any inquiries regarding Travel, Hajj, or Manpower Recruitment. Visit our office in Dhaka or call us today.',
      metaKeywords: 'Contact Nusrat International, Travel Agency Address Dhaka, Nusrat International Phone Number, BAIRA RL-1429 Office',
      activePath: '/contact',
      pageContent: content, 
      activePage: 'contact', 
      cssFiles: ['common.css', 'contact.css'] 
    });
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
    const [contentDocs, founder, teamMembers] = await Promise.all([
      db.collection('sitecontents').find({ section: 'about' }).toArray(),
      db.collection('teammembers').findOne({ isFounder: true, isActive: true }),
      db.collection('teammembers').find({ isFounder: { $ne: true }, isActive: true }).sort({ order: 1 }).toArray()
    ]);
    
    const aboutContent = {};
    contentDocs.forEach(doc => { aboutContent[doc.key] = doc; });

    res.render('about', { 
      pageTitle: 'About Nusrat International | Our Story & Leadership',
      metaDescription: 'Learn more about Nusrat International, a trusted name in the travel and recruitment industry since its inception. Discover our mission, vision, and leadership.',
      metaKeywords: 'About Nusrat International, Travel Agency History, Leadership Team, Mission and Vision, RL-1429',
      activePath: '/about',
      aboutContent, 
      founder, 
      teamMembers, 
      activePage: 'about', 
      cssFiles: ['common.css', 'About_us.css'] 
    });
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
    res.render('gallery', { 
      pageTitle: 'Photo Gallery | Memorable Moments with Nusrat International',
      metaDescription: 'Browse through our gallery to see photos from our Hajj and Umrah groups, travel tours, and office events.',
      metaKeywords: 'Nusrat International Gallery, Hajj Photos, Umrah Group Photos, Travel Tour Pictures',
      activePath: '/gallery',
      galleryItems, 
      activePage: 'about', 
      cssFiles: ['common.css', 'gallery.css'] 
    });
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
    res.render('employees', { 
      pageTitle: 'Our Team | The People Behind Nusrat International',
      metaDescription: 'Meet the dedicated team of professionals at Nusrat International who work tirelessly to provide you with the best travel and recruitment services.',
      metaKeywords: 'Nusrat International Staff, Recruitment Team Dhaka, Travel Consultants Bangladesh',
      activePath: '/employees',
      founder, 
      employees, 
      activePage: 'about', 
      cssFiles: ['common.css', 'employees.css'] 
    });
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
    res.render('certifications', { 
      pageTitle: 'Approvals & Certifications | Licensed BAIRA & IATA Agency',
      metaDescription: 'Nusrat International is fully licensed and recognized by BAIRA (RL-1429), IATA, and ATAB. View our certifications and government approvals.',
      metaKeywords: 'BAIRA RL-1429, IATA Certified Agency Bangladesh, ATAB Member, Government Approved Recruitment Agency',
      activePath: '/certifications',
      certifications, 
      activePage: 'about', 
      cssFiles: ['common.css', 'certifications.css'] 
    });
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

      const displayTitle = (typeof pkg.title === 'object' ? pkg.title.en : pkg.title) || 'Package';
      const displayDesc = (typeof pkg.description === 'object' ? pkg.description.en : pkg.description) || pkg.shortDescription || '';

      res.render(view, { 
        pageTitle: `${displayTitle} | Nusrat International`,
        metaDescription: displayDesc.substring(0, 160) || `Check out our ${displayTitle} package at Nusrat International.`,
        metaKeywords: `${displayTitle}, ${activePageKey} Package, Nusrat International`,
        activePath: `/${activePageKey}/${pkg.slug}`,
        pkg, 
        activePage: activePageKey, 
        cssFiles, 
        bodyClass: 'theme-' + activePageKey 
      });
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
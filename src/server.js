/**
 * Nusrat International - Node.js/Express Server
 * Professional implementation with MongoDB native driver integration
 * Handles dynamic content management for travel and Hajj services
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
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// MongoDB Connection
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
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
const routes = require('../routes/index');
app.use('/', routes);

// API Routes

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
    const db = req.app.locals.db;
    if (!db) {
      return res.status(404).json({ error: 'Database not available' });
    }
    const page = await db.collection('pages').findOne({ slug: req.params.slug, isActive: true });
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
    const db = req.app.locals.db;
    if (!db) {
      return res.json([]);
    }
    const pages = await db.collection('pages').find({ isActive: true }).project({ slug: 1, title: 1, metaDescription: 1 }).toArray();
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update page (admin functionality)
app.post('/api/pages', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { slug, ...updateData } = req.body;
    const page = await db.collection('pages').findOneAndUpdate(
      { slug },
      { ...updateData, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );
    res.json(page.value);
  } catch (error) {
    console.error('Error saving page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

// Content endpoints
app.get('/api/content', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.json([]);
    }
    const contents = await db.collection('contents').find({ isActive: true }).sort({ section: 1, createdAt: -1 }).toArray();
    res.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/content/:key', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(404).json({ error: 'Content not found' });
    }
    const item = await db.collection('contents').findOne({ key: req.params.key, isActive: true });
    if (!item) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update content (admin)
app.post('/api/content', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { key, ...updateData } = req.body;
    const contentItem = await db.collection('contents').findOneAndUpdate(
      { key },
      { ...updateData, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );
    res.json(contentItem.value);
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create package (admin)
app.post('/api/packages', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { category } = req.body;
    let collectionName = 'travel_packages';
    if (category === 'hajj') collectionName = 'hajj_packages';
    if (category === 'work') collectionName = 'work_packages';

    const pkg = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection(collectionName).insertOne(pkg);
    res.json({ ...pkg, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update package (admin)
app.put('/api/packages/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { category } = req.body;
    let collectionName = 'travel_packages';
    if (category === 'hajj') collectionName = 'hajj_packages';
    if (category === 'work') collectionName = 'work_packages';

    const pkg = await db.collection(collectionName).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { ...req.body, updatedAt: new Date() },
      { returnDocument: 'after' }
    );
    if (!pkg.value) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(pkg.value);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete package (admin)
app.delete('/api/packages/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(404).json({ error: 'Database not available' });
    }

    let pkg = await db.collection('travel_packages').findOne({ _id: new ObjectId(req.params.id) });
    if (!pkg) pkg = await db.collection('hajj_packages').findOne({ _id: new ObjectId(req.params.id) });
    if (!pkg) pkg = await db.collection('work_packages').findOne({ _id: new ObjectId(req.params.id) });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    if (pkg.type === 'hajj') {
      await db.collection('hajj_packages').deleteOne({ _id: new ObjectId(req.params.id) });
    } else if (pkg.type === 'work') {
      await db.collection('work_packages').deleteOne({ _id: new ObjectId(req.params.id) });
    } else {
      await db.collection('travel_packages').deleteOne({ _id: new ObjectId(req.params.id) });
    }

    res.json({ message: 'Package deleted' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Seed fake data
app.post('/api/seed', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    await db.collection('travel_packages').deleteMany({});
    await db.collection('hajj_packages').deleteMany({});
    await db.collection('work_packages').deleteMany({});
    await db.collection('homepages').deleteMany({});
    await db.collection('contents').deleteMany({});

    const homepageDoc = {
      hero_section: {
        hero_tag: 'Discover the world with Nusrat International',
        hero_title: { line1: 'Travel. Hajj. Work.', line2: 'All in one trusted package.' },
        description: {
          en: 'Your journey begins with transparent pricing, expert support, and packages designed for safe, unforgettable travel from Bangladesh.',
          bn: 'স্বচ্ছ মূল্যে, নির্ভরযোগ্য সেবা এবং নিরাপদ যাত্রার জন্য আপনার পথচলা শুরু হয়।'
        },
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
          'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=1200&q=80',
          'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1200&q=80'
        ]
      },
      certifications_section: {
        tag: 'Trusted Since 2008',
        title: { en: 'Global travel, visa and Hajj services', bn: 'গ্লোবাল ট্র্যাভেল, ভিসা ও হজ সেবা' },
        description: 'BAIRA, IATA, ATAB endorsements with strong local support for every package.',
        certifications: [
          { name: 'BAIRA', image: '/css/certifications.css', description: 'Recognized Bangladeshi travel agency', tag: 'Member' },
          { name: 'IATA', image: '/css/certifications.css', description: 'International Air Transport Association', tag: 'Accredited' },
          { name: 'ATAB', image: '/css/certifications.css', description: 'Assisted Tourism Agency Bangladesh', tag: 'Verified' }
        ]
      },
      ticketing_section: {
        tag: 'Quick Booking',
        title: { en: 'Ticketing & Visa Support', bn: 'টিকিটিং ও ভিসা সাপোর্ট' },
        description: 'Call or WhatsApp us to start your booking process instantly.',
        contact: { phone: '+880123456789', whatsapp: '+880123456789' }
      },
      travel_section_intro: {
        tag: 'Best Destinations',
        title: { en: 'Popular Travel Packages', bn: 'জনপ্রিয় ট্র্যাভেল প্যাকেজসমূহ' },
        description: 'Carefully curated travel plans for families, honeymooners and adventure seekers.'
      },
      hajj_featured_section: {
        featured_image: 'https://images.unsplash.com/photo-1589650570439-8baf6a011f0a?w=1200&q=80',
        title: { en: 'Hajj & Umrah Made Easy', bn: 'হজ ও উমরাহ সহজ করুণ' },
        tagline: 'Complete guidance from visa processing to holy stay arrangements.'
      },
      work_section_intro: {
        tag: 'Overseas Jobs',
        title: { en: 'Trusted Work Visa Packages', bn: 'বিশ্বস্ত ওয়ার্ক ভিসা প্যাকেজসমূহ' },
        description: 'Secure placements with verified employers in Malaysia, Singapore and Dubai.'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const travelPackages = [
      {
        type: 'travel',
        slug: 'santorini-greece',
        title_en: 'Santorini, Greece',
        title_bn: 'সান্তোরিনি, গ্রীস',
        badge: 'Best Seller',
        price: 799,
        price_note: 'From per person',
        duration: '7 Days',
        rating: 4.8,
        hero_image: 'https://picsum.photos/id/1018/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1018/500/350',
        shortDescription_en: 'Whitewashed villages, volcanic beaches, and sunsets over the Aegean.',
        about_en: 'Experience the iconic blue-domed churches, cliffside sunsets, and a romantic Greek island escape. Includes flights, hotels, transfers and guided tours.',
        about_bn: 'প্রশান্ত এজিয়ান সাগরের তার তার সূর্যাস্ত, রোমান্টিক গ্রিক দ্বীপের অভিজ্ঞতা এবং  ফ্লাইট, হোটেল, ট্রান্সফার ও গাইডেড ট্যুর অন্তর্ভুক্ত।',
        highlights: [
          { icon: '🏖️', title: 'Private Beach Visit', subtitle: 'Relax by the sea', desc: 'Spend quality time on famous volcanic beaches.' },
          { icon: '🍷', title: 'Local Cuisine', subtitle: 'Greek dining', desc: 'Taste fresh seafood, salads, and island specialties.' },
          { icon: '🛥️', title: 'Island Cruise', subtitle: 'Aegean adventure', desc: 'Enjoy a sunset cruise around Santorini.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Athens', desc: 'Transfer to Santorini and relax in your hotel.', label: 'Day 1' },
          { day: 2, title: 'Oia & Fira', desc: 'Explore cliffside towns and iconic blue domes.', label: 'Day 2' },
          { day: 3, title: 'Volcanic Beach', desc: 'Visit Red Beach and Kamari Beach.', label: 'Day 3' }
        ],
        includes: ['Return flights', '4-star hotel', 'Daily breakfast', 'Airport transfers'],
        excludes: ['Personal expenses', 'Travel insurance', 'Optional tours'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'travel',
        slug: 'maldives',
        title_en: 'Maldives',
        title_bn: 'মালদ্বীপ',
        badge: 'Popular',
        price: 999,
        price_note: 'Starting price',
        duration: '10 Days',
        rating: 4.9,
        hero_image: 'https://picsum.photos/id/1015/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1015/500/350',
        shortDescription_en: 'Luxury island resorts, crystal-clear lagoons and ocean villas.',
        about_en: 'Stay in an overwater villa, snorkel coral reefs, and enjoy beachside leisure with premium dining packages.',
        about_bn: 'ওভারওয়াটার ভিলায় থাকা, প্রবাল প্রাচীরের সামান্য সাঁতার এবং বিলাসবহুল বিচ-লাইজার।',
        highlights: [
          { icon: '🏝️', title: 'Overwater Villa', subtitle: 'Private luxury', desc: 'Stay above the turquoise lagoon.' },
          { icon: '🤿', title: 'Snorkel & Dive', subtitle: 'Marine life', desc: 'Explore colorful reefs and sea turtles.' },
          { icon: '🍹', title: 'Resort Dining', subtitle: 'All-inclusive', desc: 'Enjoy chef-curated meals and beach bars.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Malé', desc: 'Transfer to resort by speedboat.', label: 'Day 1' },
          { day: 2, title: 'Island Relaxation', desc: 'Enjoy resort amenities and beach time.', label: 'Day 2' }
        ],
        includes: ['Return airfare', 'Resort stay', 'All meals', 'Resort transfers'],
        excludes: ['Spa services', 'Optional excursions', 'Tips'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'travel',
        slug: 'dubai-uae',
        title_en: 'Dubai, UAE',
        title_bn: 'দুবাই, সংযুক্ত আরব আমিরাত',
        badge: 'City Break',
        price: 899,
        price_note: 'Approximate',
        duration: '6 Days',
        rating: 4.7,
        hero_image: 'https://picsum.photos/id/1019/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1019/500/350',
        shortDescription_en: 'Modern skyscrapers, desert adventures and world-class shopping.',
        about_en: 'Explore Dubai\'s iconic skyline, desert safari, theme parks, and premium shopping experiences with a well-rounded itinerary.',
        about_bn: 'দুবাইয়ের আধুনিক আকাশচুম্বী ভবন, মরুভূমি ভ্রমণ এবং বিশ্বমানের কেনাকাটা।',
        highlights: [
          { icon: '🏜️', title: 'Desert Safari', subtitle: 'Adventure', desc: 'Enjoy dunes, camel rides and an evening show.' },
          { icon: '🏙️', title: 'City Tour', subtitle: 'Burj Khalifa', desc: 'Visit the tallest tower and Dubai Mall.' },
          { icon: '🛍️', title: 'Shopping', subtitle: 'Luxury malls', desc: "Shop in the world's premium retail destinations." }
        ],
        itinerary: [
          { day: 1, title: 'Arrival & Relax', desc: 'Settle into your hotel near downtown Dubai.', label: 'Day 1' },
          { day: 2, title: 'City Highlights', desc: 'Tour Burj Khalifa, Dubai Mall and Palm Jumeirah.', label: 'Day 2' }
        ],
        includes: ['Return tickets', 'Hotel stay', 'Breakfast', 'Airport transfers'],
        excludes: ['Visa fees', 'Optional tours', 'Meals outside breakfast'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const hajjPackages = [
      {
        type: 'hajj',
        slug: 'standard-hajj',
        title_en: 'Standard Hajj Package',
        title_bn: 'স্ট্যান্ডার্ড হজ প্যাকেজ',
        badge: 'Most Booked',
        price: 2999,
        price_note: 'Package price per pilgrim',
        duration: '21 Days',
        rating: 4.8,
        hero_image: 'https://picsum.photos/id/1037/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1037/500/350',
        shortDescription_en: 'Affordable Hajj with comfortable 3-star accommodation and guided services.',
        about_en: 'Stay close to Haram in both Makkah and Madinah with visa processing, transport, and religious guidance included.',
        about_bn: 'মক্কা ও মদিনায় ৩-তারকা হোটেল, ভিসা প্রক্রিয়া, পরিবহন ও ধর্মীয় সেবা।',
        highlights: [
          { icon: '🕋', title: 'Makkah Stay', subtitle: '3-star hotel', desc: 'Near Masjid al-Haram for easy access.' },
          { icon: '🕌', title: 'Madinah Stay', subtitle: 'Convenient location', desc: 'Near Masjid an-Nabawi with comfortable rooms.' },
          { icon: '✈️', title: 'Flight Included', subtitle: 'Return airfare', desc: 'Bangladesh to Jeddah and back.' }
        ],
        itinerary: [
          { day: 1, title: 'Departure & Arrival', desc: 'Fly to Jeddah and transfer to your hotel.', label: 'Day 1' },
          { day: 2, title: 'Makkah Arrival', desc: 'Complete Umrah rites and settle in.', label: 'Day 2' },
          { day: 14, title: 'Arafat & Muzdalifah', desc: 'Perform the key Hajj rituals with expert support.', label: 'Day 14' }
        ],
        includes: ['Visa processing', 'Airfare', 'Hotels', 'Guided rituals'],
        excludes: ['Personal spending', 'Insurance', 'Extra meals'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'hajj',
        slug: 'premium-hajj',
        title_en: 'Premium Hajj Package',
        title_bn: 'প্রিমিয়াম হজ প্যাকেজ',
        badge: 'Luxury',
        price: 4499,
        price_note: 'Luxury package',
        duration: '25 Days',
        rating: 5.0,
        hero_image: 'https://picsum.photos/id/1039/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1039/500/350',
        shortDescription_en: 'Luxury Hajj with premium hotels, spacious transport and attentive service.',
        about_en: 'Enjoy premium lodging, dedicated group leaders, and a relaxed stay close to the holy mosques.',
        about_bn: 'প্রিমিয়াম হোটেল, নির্দিষ্ট গ্রুপ নেতৃত্ব এবং আরামদায়ক অবস্থান।',
        highlights: [
          { icon: '🌟', title: 'Premium Hotels', subtitle: 'Luxury rooms', desc: 'High-comfort accommodation near Haram.' },
          { icon: '🚐', title: 'Luxury Transport', subtitle: 'Comfort travel', desc: 'Private buses for all transfers.' },
          { icon: '👨‍🏫', title: 'Guided Support', subtitle: 'Experienced staff', desc: 'Expert Hajj guidance throughout the trip.' }
        ],
        itinerary: [
          { day: 1, title: 'Departure from Dhaka', desc: 'Fly directly to Jeddah and transfer in comfort.', label: 'Day 1' },
          { day: 7, title: 'Makkah Stay', desc: 'Attend rituals with privileged access and support.', label: 'Day 7' }
        ],
        includes: ['Premium hotels', 'Private transport', 'Visa support', 'Guided group leader'],
        excludes: ['Personal expenses', 'Optional services', 'Travel insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'umrah',
        slug: 'umrah-package',
        title_en: 'Umrah Package',
        title_bn: 'উমরাহ প্যাকেজ',
        badge: 'Short Trip',
        price: 1599,
        price_note: '14-day package',
        duration: '14 Days',
        rating: 4.9,
        hero_image: 'https://picsum.photos/id/1040/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1040/500/350',
        shortDescription_en: 'A complete Umrah program with religious guidance and city visits.',
        about_en: 'Includes hotel stays, local transport, and guided visits to Makkah, Madinah and historic holy sites.',
        about_bn: 'মক্কা, মদিনা এবং ঐতিহাসিক স্থানসমূহের গাইডেড ভ্রমণ সহ উমরাহ।',
        highlights: [
          { icon: '🕌', title: 'Complete Umrah', subtitle: 'Guided rituals', desc: 'Support for all Umrah rites and ziyarat.' },
          { icon: '🏨', title: 'Hotel Stays', subtitle: 'Comfortable rooms', desc: 'Good hotels in Makkah and Madinah.' },
          { icon: '🗺️', title: 'City Visits', subtitle: 'Historical sites', desc: 'Visit landmarks around Makkah and Madinah.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Jeddah', desc: 'Transfer to Makkah and perform Umrah.', label: 'Day 1' },
          { day: 5, title: 'Madinah Visit', desc: 'Travel to Madinah with guided ziyarat.', label: 'Day 5' }
        ],
        includes: ['Visa', 'Flights', 'Hotels', 'Transport'],
        excludes: ['Food outside package', 'Travel insurance', 'Personal expenses'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const workPackages = [
      {
        type: 'work',
        slug: 'malaysia-work-visa',
        title_en: 'Malaysia Work Visa',
        title_bn: 'মালয়েশিয়া ওয়ার্ক ভিসা',
        badge: 'Best Value',
        price: 599,
        price_note: 'Visa processing fee only',
        duration: '2 Years',
        rating: 4.7,
        hero_image: 'https://picsum.photos/id/1062/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1062/500/350',
        shortDescription_en: 'Factory and construction placements with verified employers and support.',
        about_en: 'Secure work assignments in Malaysia with documented contract support, visa processing, and onboarding guidance.',
        about_bn: 'মালয়েশিয়ায় প্রমাণিত নিয়োগকর্তার মাধ্যমে শ্রমিক নিয়োগ, ভিসা প্রক্রিয়া ও সহায়তা।',
        location: 'Malaysia',
        salary: 'MYR 1,200–2,000/mo',
        job_type: 'Factory & Construction',
        includes: ['Visa processing', 'Job placement support', 'Documentation assistance'],
        excludes: ['Airfare', 'Personal expenses', 'Insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'work',
        slug: 'singapore-work-permit',
        title_en: 'Singapore Work Permit',
        title_bn: 'সিঙ্গাপুর ওয়ার্ক পারমিট',
        badge: 'Skilled Jobs',
        price: 799,
        price_note: 'Professional placement',
        duration: '3 Years',
        rating: 4.9,
        hero_image: 'https://picsum.photos/id/1071/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1071/500/350',
        shortDescription_en: 'Skilled job opportunities with competitive salary and safe placement.',
        about_en: 'Find professional work in Singapore with employer verification, permit processing, and relocation guidance.',
        about_bn: 'দক্ষ কর্মীদের জন্য সিঙ্গাপুরে নিরাপদ নিয়োগ এবং কর্ম অনুমতি প্রক্রিয়া।',
        location: 'Singapore',
        salary: 'SGD 2,000–3,500/mo',
        job_type: 'Skilled Jobs',
        includes: ['Work permit support', 'Employer referrals', 'Documentation help'],
        excludes: ['Airfare', 'Living costs', 'Insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'work',
        slug: 'dubai-employment',
        title_en: 'Dubai Employment',
        title_bn: 'দুবাই কর্মসংস্থান',
        badge: 'Top Destination',
        price: 699,
        price_note: 'Placement assistance',
        duration: '2 Years',
        rating: 4.8,
        hero_image: 'https://picsum.photos/id/1019/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1019/500/350',
        shortDescription_en: 'Tax-free salaries in hospitality and construction with reliable employer support.',
        about_en: 'Obtain verified job offers in Dubai with contract support, accommodation guidance, and visa assistance.',
        about_bn: 'দুবাইয়ে ট্যাক্স-মুক্ত বেতন, প্রমাণিত নিয়োগকর্তার মাধ্যমে কাজের সুযোগ।',
        location: 'Dubai, UAE',
        salary: 'AED 3,000–5,000/mo',
        job_type: 'Hospitality & Construction',
        includes: ['Job placement', 'Visa guidance', 'Contract review'],
        excludes: ['Travel costs', 'Accommodation', 'Insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('homepages').insertOne(homepageDoc);
    await db.collection('travel_packages').insertMany(travelPackages);
    await db.collection('hajj_packages').insertMany(hajjPackages);
    await db.collection('work_packages').insertMany(workPackages);

    await db.collection('contents').insertMany([
      {
        key: 'homepage-hero',
        section: 'hero',
        title_en: 'Explore Beyond The Horizon',
        subtitle_en: 'Unforgettable journeys crafted for the curious soul.',
        description_en: 'Discover handpicked Hajj, travel and work packages with transparent pricing and guaranteed service quality.',
        title_bn: 'ক্ষিতিজের বাইরে অন্বেষণ করুন',
        subtitle_bn: 'কৌতূহলী মন করুণ সাফল্য ভ্রমণ।',
        description_bn: 'স্বচ্ছ মূল্যে হজ, ট্র্যাভেল ও ওয়ার্ক প্যাকেজ। আপনার যাত্রা হোক নিরাপদ ও আরামদায়ক।',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homepage-services',
        section: 'services',
        title_en: 'Our Services',
        subtitle_en: 'Full-service travel & visa support from Bangladesh to the world.',
        description_en: 'Packages include visa, flights, accommodation, local transport, and 24/7 guidance.',
        title_bn: 'আমাদের সেবা',
        subtitle_bn: 'বাংলাদেশ থেকে বিশ্ব পর্যন্ত পূর্ণ-সেবা।',
        description_bn: 'ভিসা, ফ্লাইট, আবাসন, স্থানীয় পরিবহন ও ২৪/৭ সাপোর্ট অন্তর্ভুক্ত।',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homepage-credentials',
        section: 'credentials',
        title_en: 'Certified & Trusted',
        subtitle_en: 'BAIRA, IATA, and ATAB approved with government compliance.',
        description_en: 'Strong reputations built on 15+ years of reliable service.',
        title_bn: 'সার্টিফাইড ও বিশ্বাসযোগ্য',
        subtitle_bn: 'BAIRA, IATA ও ATAB অনুমোদিত।',
        description_bn: '১৫+ বছরের বিশ্বস্ত কাজের অভিজ্ঞতা।',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    res.json({ message: 'Database seeded with travel, hajj, work and homepage content' });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  process.exit(0);
});

module.exports = app;

// Create or update page (admin functionality)
app.post('/api/pages', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { slug, ...updateData } = req.body;
    const page = await db.collection('pages').findOneAndUpdate(
      { slug },
      { ...updateData, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );
    res.json(page.value);
  } catch (error) {
    console.error('Error saving page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

// Content endpoints
app.get('/api/content', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.json([]);
    }
    const contents = await db.collection('contents').find({ isActive: true }).sort({ section: 1, createdAt: -1 }).toArray();
    res.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/content/:key', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(404).json({ error: 'Content not found' });
    }
    const item = await db.collection('contents').findOne({ key: req.params.key, isActive: true });
    if (!item) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update content (admin)
app.post('/api/content', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { key, ...updateData } = req.body;
    const contentItem = await db.collection('contents').findOneAndUpdate(
      { key },
      { ...updateData, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );
    res.json(contentItem.value);
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create package (admin)
app.post('/api/packages', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { category } = req.body;
    let collectionName = 'travel_packages';
    if (category === 'hajj') collectionName = 'hajj_packages';
    if (category === 'work') collectionName = 'work_packages';

    const pkg = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection(collectionName).insertOne(pkg);
    res.json({ ...pkg, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update package (admin)
app.put('/api/packages/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }
    const { category } = req.body;
    let collectionName = 'travel_packages';
    if (category === 'hajj') collectionName = 'hajj_packages';
    if (category === 'work') collectionName = 'work_packages';

    const pkg = await db.collection(collectionName).findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { ...req.body, updatedAt: new Date() },
      { returnDocument: 'after' }
    );
    if (!pkg.value) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(pkg.value);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete package (admin)
app.delete('/api/packages/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(404).json({ error: 'Database not available' });
    }

    let pkg = await db.collection('travel_packages').findOne({ _id: new ObjectId(req.params.id) });
    if (!pkg) pkg = await db.collection('hajj_packages').findOne({ _id: new ObjectId(req.params.id) });
    if (!pkg) pkg = await db.collection('work_packages').findOne({ _id: new ObjectId(req.params.id) });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    if (pkg.type === 'hajj') {
      await db.collection('hajj_packages').deleteOne({ _id: new ObjectId(req.params.id) });
    } else if (pkg.type === 'work') {
      await db.collection('work_packages').deleteOne({ _id: new ObjectId(req.params.id) });
    } else {
      await db.collection('travel_packages').deleteOne({ _id: new ObjectId(req.params.id) });
    }

    res.json({ message: 'Package deleted' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Seed fake data
app.post('/api/seed', async (req, res) => {
  try {
    await TravelPackage.deleteMany({});
    await HajjPackage.deleteMany({});
    await WorkPackage.deleteMany({});
    await Homepage.deleteMany({});
    await Content.deleteMany({});

    const homepageDoc = {
      hero_section: {
        hero_tag: 'Discover the world with Nusrat International',
        hero_title: { line1: 'Travel. Hajj. Work.', line2: 'All in one trusted package.' },
        description: {
          en: 'Your journey begins with transparent pricing, expert support, and packages designed for safe, unforgettable travel from Bangladesh.',
          bn: 'স্বচ্ছ মূল্যে, নির্ভরযোগ্য সেবা এবং নিরাপদ যাত্রার জন্য আপনার পথচলা শুরু হয়।'
        },
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
          'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=1200&q=80',
          'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1200&q=80'
        ]
      },
      certifications_section: {
        tag: 'Trusted Since 2008',
        title: { en: 'Global travel, visa and Hajj services', bn: 'গ্লোবাল ট্র্যাভেল, ভিসা ও হজ সেবা' },
        description: 'BAIRA, IATA, ATAB endorsements with strong local support for every package.',
        certifications: [
          { name: 'BAIRA', image: '/css/certifications.css', description: 'Recognized Bangladeshi travel agency', tag: 'Member' },
          { name: 'IATA', image: '/css/certifications.css', description: 'International Air Transport Association', tag: 'Accredited' },
          { name: 'ATAB', image: '/css/certifications.css', description: 'Assisted Tourism Agency Bangladesh', tag: 'Verified' }
        ]
      },
      ticketing_section: {
        tag: 'Quick Booking',
        title: { en: 'Ticketing & Visa Support', bn: 'টিকিটিং ও ভিসা সাপোর্ট' },
        description: 'Call or WhatsApp us to start your booking process instantly.',
        contact: { phone: '+880123456789', whatsapp: '+880123456789' }
      },
      travel_section_intro: {
        tag: 'Best Destinations',
        title: { en: 'Popular Travel Packages', bn: 'জনপ্রিয় ট্র্যাভেল প্যাকেজসমূহ' },
        description: 'Carefully curated travel plans for families, honeymooners and adventure seekers.'
      },
      hajj_featured_section: {
        featured_image: 'https://images.unsplash.com/photo-1589650570439-8baf6a011f0a?w=1200&q=80',
        title: { en: 'Hajj & Umrah Made Easy', bn: 'হজ ও উমরাহ সহজ করুণ' },
        tagline: 'Complete guidance from visa processing to holy stay arrangements.'
      },
      work_section_intro: {
        tag: 'Overseas Jobs',
        title: { en: 'Trusted Work Visa Packages', bn: 'বিশ্বস্ত ওয়ার্ক ভিসা প্যাকেজসমূহ' },
        description: 'Secure placements with verified employers in Malaysia, Singapore and Dubai.'
      }
    };

    const travelPackages = [
      {
        type: 'travel',
        slug: 'santorini-greece',
        title_en: 'Santorini, Greece',
        title_bn: 'সান্তোরিনি, গ্রীস',
        badge: 'Best Seller',
        price: 799,
        price_note: 'From per person',
        duration: '7 Days',
        rating: 4.8,
        hero_image: 'https://picsum.photos/id/1018/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1018/500/350',
        shortDescription_en: 'Whitewashed villages, volcanic beaches, and sunsets over the Aegean.',
        about_en: 'Experience the iconic blue-domed churches, cliffside sunsets, and a romantic Greek island escape. Includes flights, hotels, transfers and guided tours.',
        about_bn: 'প্রশান্ত এজিয়ান সাগরের তার তার সূর্যাস্ত, রোমান্টিক গ্রিক দ্বীপের অভিজ্ঞতা এবং  ফ্লাইট, হোটেল, ট্রান্সফার ও গাইডেড ট্যুর অন্তর্ভুক্ত।',
        highlights: [
          { icon: '🏖️', title: 'Private Beach Visit', subtitle: 'Relax by the sea', desc: 'Spend quality time on famous volcanic beaches.' },
          { icon: '🍷', title: 'Local Cuisine', subtitle: 'Greek dining', desc: 'Taste fresh seafood, salads, and island specialties.' },
          { icon: '🛥️', title: 'Island Cruise', subtitle: 'Aegean adventure', desc: 'Enjoy a sunset cruise around Santorini.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Athens', desc: 'Transfer to Santorini and relax in your hotel.', label: 'Day 1' },
          { day: 2, title: 'Oia & Fira', desc: 'Explore cliffside towns and iconic blue domes.', label: 'Day 2' },
          { day: 3, title: 'Volcanic Beach', desc: 'Visit Red Beach and Kamari Beach.', label: 'Day 3' }
        ],
        includes: ['Return flights', '4-star hotel', 'Daily breakfast', 'Airport transfers'],
        excludes: ['Personal expenses', 'Travel insurance', 'Optional tours']
      },
      {
        type: 'travel',
        slug: 'maldives',
        title_en: 'Maldives',
        title_bn: 'মালদ্বীপ',
        badge: 'Popular',
        price: 999,
        price_note: 'Starting price',
        duration: '10 Days',
        rating: 4.9,
        hero_image: 'https://picsum.photos/id/1015/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1015/500/350',
        shortDescription_en: 'Luxury island resorts, crystal-clear lagoons and ocean villas.',
        about_en: 'Stay in an overwater villa, snorkel coral reefs, and enjoy beachside leisure with premium dining packages.',
        about_bn: 'ওভারওয়াটার ভিলায় থাকা, প্রবাল প্রাচীরের সামান্য সাঁতার এবং বিলাসবহুল বিচ-লাইজার।',
        highlights: [
          { icon: '🏝️', title: 'Overwater Villa', subtitle: 'Private luxury', desc: 'Stay above the turquoise lagoon.' },
          { icon: '🤿', title: 'Snorkel & Dive', subtitle: 'Marine life', desc: 'Explore colorful reefs and sea turtles.' },
          { icon: '🍹', title: 'Resort Dining', subtitle: 'All-inclusive', desc: 'Enjoy chef-curated meals and beach bars.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Malé', desc: 'Transfer to resort by speedboat.', label: 'Day 1' },
          { day: 2, title: 'Island Relaxation', desc: 'Enjoy resort amenities and beach time.', label: 'Day 2' }
        ],
        includes: ['Return airfare', 'Resort stay', 'All meals', 'Resort transfers'],
        excludes: ['Spa services', 'Optional excursions', 'Tips']
      },
      {
        type: 'travel',
        slug: 'dubai-uae',
        title_en: 'Dubai, UAE',
        title_bn: 'দুবাই, সংযুক্ত আরব আমিরাত',
        badge: 'City Break',
        price: 899,
        price_note: 'Approximate',
        duration: '6 Days',
        rating: 4.7,
        hero_image: 'https://picsum.photos/id/1019/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1019/500/350',
        shortDescription_en: 'Modern skyscrapers, desert adventures and world-class shopping.',
        about_en: 'Explore Dubai’s iconic skyline, desert safari, theme parks, and premium shopping experiences with a well-rounded itinerary.',
        about_bn: 'দুবাইয়ের আধুনিক আকাশচুম্বী ভবন, মরুভূমি ভ্রমণ এবং বিশ্বমানের কেনাকাটা।',
        highlights: [
          { icon: '🏜️', title: 'Desert Safari', subtitle: 'Adventure', desc: 'Enjoy dunes, camel rides and an evening show.' },
          { icon: '🏙️', title: 'City Tour', subtitle: 'Burj Khalifa', desc: 'Visit the tallest tower and Dubai Mall.' },
          { icon: '🛍️', title: 'Shopping', subtitle: 'Luxury malls', desc: 'Shop in the world’s premium retail destinations.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival & Relax', desc: 'Settle into your hotel near downtown Dubai.', label: 'Day 1' },
          { day: 2, title: 'City Highlights', desc: 'Tour Burj Khalifa, Dubai Mall and Palm Jumeirah.', label: 'Day 2' }
        ],
        includes: ['Return tickets', 'Hotel stay', 'Breakfast', 'Airport transfers'],
        excludes: ['Visa fees', 'Optional tours', 'Meals outside breakfast']
      }
    ];

    const hajjPackages = [
      {
        type: 'hajj',
        slug: 'standard-hajj',
        title_en: 'Standard Hajj Package',
        title_bn: 'স্ট্যান্ডার্ড হজ প্যাকেজ',
        badge: 'Most Booked',
        price: 2999,
        price_note: 'Package price per pilgrim',
        duration: '21 Days',
        rating: 4.8,
        hero_image: 'https://picsum.photos/id/1037/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1037/500/350',
        shortDescription_en: 'Affordable Hajj with comfortable 3-star accommodation and guided services.',
        about_en: 'Stay close to Haram in both Makkah and Madinah with visa processing, transport, and religious guidance included.',
        about_bn: 'মক্কা ও মদিনায় ৩-তারকা হোটেল, ভিসা প্রক্রিয়া, পরিবহন ও ধর্মীয় সেবা।',
        highlights: [
          { icon: '🕋', title: 'Makkah Stay', subtitle: '3-star hotel', desc: 'Near Masjid al-Haram for easy access.' },
          { icon: '🕌', title: 'Madinah Stay', subtitle: 'Convenient location', desc: 'Near Masjid an-Nabawi with comfortable rooms.' },
          { icon: '✈️', title: 'Flight Included', subtitle: 'Return airfare', desc: 'Bangladesh to Jeddah and back.' }
        ],
        itinerary: [
          { day: 1, title: 'Departure & Arrival', desc: 'Fly to Jeddah and transfer to your hotel.', label: 'Day 1' },
          { day: 2, title: 'Makkah Arrival', desc: 'Complete Umrah rites and settle in.', label: 'Day 2' },
          { day: 14, title: 'Arafat & Muzdalifah', desc: 'Perform the key Hajj rituals with expert support.', label: 'Day 14' }
        ],
        includes: ['Visa processing', 'Airfare', 'Hotels', 'Guided rituals'],
        excludes: ['Personal spending', 'Insurance', 'Extra meals']
      },
      {
        type: 'hajj',
        slug: 'premium-hajj',
        title_en: 'Premium Hajj Package',
        title_bn: 'প্রিমিয়াম হজ প্যাকেজ',
        badge: 'Luxury',
        price: 4499,
        price_note: 'Luxury package',
        duration: '25 Days',
        rating: 5.0,
        hero_image: 'https://picsum.photos/id/1039/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1039/500/350',
        shortDescription_en: 'Luxury Hajj with premium hotels, spacious transport and attentive service.',
        about_en: 'Enjoy premium lodging, dedicated group leaders, and a relaxed stay close to the holy mosques.',
        about_bn: 'প্রিমিয়াম হোটেল, নির্দিষ্ট গ্রুপ নেতৃত্ব এবং আরামদায়ক অবস্থান।',
        highlights: [
          { icon: '🌟', title: 'Premium Hotels', subtitle: 'Luxury rooms', desc: 'High-comfort accommodation near Haram.' },
          { icon: '🚐', title: 'Luxury Transport', subtitle: 'Comfort travel', desc: 'Private buses for all transfers.' },
          { icon: '👨‍🏫', title: 'Guided Support', subtitle: 'Experienced staff', desc: 'Expert Hajj guidance throughout the trip.' }
        ],
        itinerary: [
          { day: 1, title: 'Departure from Dhaka', desc: 'Fly directly to Jeddah and transfer in comfort.', label: 'Day 1' },
          { day: 7, title: 'Makkah Stay', desc: 'Attend rituals with privileged access and support.', label: 'Day 7' }
        ],
        includes: ['Premium hotels', 'Private transport', 'Visa support', 'Guided group leader'],
        excludes: ['Personal expenses', 'Optional services', 'Travel insurance']
      },
      {
        type: 'umrah',
        slug: 'umrah-package',
        title_en: 'Umrah Package',
        title_bn: 'উমরাহ প্যাকেজ',
        badge: 'Short Trip',
        price: 1599,
        price_note: '14-day package',
        duration: '14 Days',
        rating: 4.9,
        hero_image: 'https://picsum.photos/id/1040/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1040/500/350',
        shortDescription_en: 'A complete Umrah program with religious guidance and city visits.',
        about_en: 'Includes hotel stays, local transport, and guided visits to Makkah, Madinah and historic holy sites.',
        about_bn: 'মক্কা, মদিনা এবং ঐতিহাসিক স্থানসমূহের গাইডেড ভ্রমণ সহ উমরাহ।',
        highlights: [
          { icon: '🕌', title: 'Complete Umrah', subtitle: 'Guided rituals', desc: 'Support for all Umrah rites and ziyarat.' },
          { icon: '🏨', title: 'Hotel Stays', subtitle: 'Comfortable rooms', desc: 'Good hotels in Makkah and Madinah.' },
          { icon: '🗺️', title: 'City Visits', subtitle: 'Historical sites', desc: 'Visit landmarks around Makkah and Madinah.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Jeddah', desc: 'Transfer to Makkah and perform Umrah.', label: 'Day 1' },
          { day: 5, title: 'Madinah Visit', desc: 'Travel to Madinah with guided ziyarat.', label: 'Day 5' }
        ],
        includes: ['Visa', 'Flights', 'Hotels', 'Transport'],
        excludes: ['Food outside package', 'Travel insurance', 'Personal expenses']
      }
    ];

    const workPackages = [
      {
        type: 'work',
        slug: 'malaysia-work-visa',
        title_en: 'Malaysia Work Visa',
        title_bn: 'মালয়েশিয়া ওয়ার্ক ভিসা',
        badge: 'Best Value',
        price: 599,
        price_note: 'Visa processing fee only',
        duration: '2 Years',
        rating: 4.7,
        hero_image: 'https://picsum.photos/id/1062/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1062/500/350',
        shortDescription_en: 'Factory and construction placements with verified employers and support.',
        about_en: 'Secure work assignments in Malaysia with documented contract support, visa processing, and onboarding guidance.',
        about_bn: 'মালয়েশিয়ায় প্রমাণিত নিয়োগকর্তার মাধ্যমে শ্রমিক নিয়োগ, ভিসা প্রক্রিয়া ও সহায়তা।',
        location: 'Malaysia',
        salary: 'MYR 1,200–2,000/mo',
        job_type: 'Factory & Construction',
        includes: ['Visa processing', 'Job placement support', 'Documentation assistance'],
        excludes: ['Airfare', 'Personal expenses', 'Insurance']
      },
      {
        type: 'work',
        slug: 'singapore-work-permit',
        title_en: 'Singapore Work Permit',
        title_bn: 'সিঙ্গাপুর ওয়ার্ক পারমিট',
        badge: 'Skilled Jobs',
        price: 799,
        price_note: 'Professional placement',
        duration: '3 Years',
        rating: 4.9,
        hero_image: 'https://picsum.photos/id/1071/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1071/500/350',
        shortDescription_en: 'Skilled job opportunities with competitive salary and safe placement.',
        about_en: 'Find professional work in Singapore with employer verification, permit processing, and relocation guidance.',
        about_bn: 'দক্ষ কর্মীদের জন্য সিঙ্গাপুরে নিরাপদ নিয়োগ এবং কর্ম অনুমতি প্রক্রিয়া।',
        location: 'Singapore',
        salary: 'SGD 2,000–3,500/mo',
        job_type: 'Skilled Jobs',
        includes: ['Work permit support', 'Employer referrals', 'Documentation help'],
        excludes: ['Airfare', 'Living costs', 'Insurance']
      },
      {
        type: 'work',
        slug: 'dubai-employment',
        title_en: 'Dubai Employment',
        title_bn: 'দুবাই কর্মসংস্থান',
        badge: 'Top Destination',
        price: 699,
        price_note: 'Placement assistance',
        duration: '2 Years',
        rating: 4.8,
        hero_image: 'https://picsum.photos/id/1019/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1019/500/350',
        shortDescription_en: 'Tax-free salaries in hospitality and construction with reliable employer support.',
        about_en: 'Obtain verified job offers in Dubai with contract support, accommodation guidance, and visa assistance.',
        about_bn: 'দুবাইয়ে ট্যাক্স-মুক্ত বেতন, প্রমাণিত নিয়োগকর্তার মাধ্যমে কাজের সুযোগ।',
        location: 'Dubai, UAE',
        salary: 'AED 3,000–5,000/mo',
        job_type: 'Hospitality & Construction',
        includes: ['Job placement', 'Visa guidance', 'Contract review'],
        excludes: ['Travel costs', 'Accommodation', 'Insurance']
      }
    ];

    await Homepage.create(homepageDoc);
    await TravelPackage.insertMany(travelPackages);
    await HajjPackage.insertMany(hajjPackages);
    await WorkPackage.insertMany(workPackages);

    await Content.insertMany([
      {
        key: 'homepage-hero',
        section: 'hero',
        title_en: 'Explore Beyond The Horizon',
        subtitle_en: 'Unforgettable journeys crafted for the curious soul.',
        description_en: 'Discover handpicked Hajj, travel and work packages with transparent pricing and guaranteed service quality.',
        title_bn: 'ক্ষিতিজের বাইরে অন্বেষণ করুন',
        subtitle_bn: 'কৌতূহলী মন করুণ সাফল্য ভ্রমণ।',
        description_bn: 'স্বচ্ছ মূল্যে হজ, ট্র্যাভেল ও ওয়ার্ক প্যাকেজ। আপনার যাত্রা হোক নিরাপদ ও আরামদায়ক।'
      },
      {
        key: 'homepage-services',
        section: 'services',
        title_en: 'Our Services',
        subtitle_en: 'Full-service travel & visa support from Bangladesh to the world.',
        description_en: 'Packages include visa, flights, accommodation, local transport, and 24/7 guidance.',
        title_bn: 'আমাদের সেবা',
        subtitle_bn: 'বাংলাদেশ থেকে বিশ্ব পর্যন্ত পূর্ণ-সেবা।',
        description_bn: 'ভিসা, ফ্লাইট, আবাসন, স্থানীয় পরিবহন ও ২৪/৭ সাপোর্ট অন্তর্ভুক্ত।'
      },
      {
        key: 'homepage-credentials',
        section: 'credentials',
        title_en: 'Certified & Trusted',
        subtitle_en: 'BAIRA, IATA, and ATAB approved with government compliance.',
        description_en: 'Strong reputations built on 15+ years of reliable service.',
        title_bn: 'সার্টিফাইড ও বিশ্বাসযোগ্য',
        subtitle_bn: 'BAIRA, IATA ও ATAB অনুমোদিত।',
        description_bn: '১৫+ বছরের বিশ্বস্ত কাজের অভিজ্ঞতা।'
      }
    ]);

    res.json({ message: 'Database seeded with travel, hajj, work and homepage content' });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes for dynamic pages
app.get('/', async (req, res) => {
  try {
    const travelPackages = await TravelPackage.find({ isActive: true }).sort({ createdAt: -1 }).limit(4);
    const hajjPackages = await HajjPackage.find({ isActive: true }).sort({ createdAt: -1 }).limit(4);
    const workPackages = await WorkPackage.find({ isActive: true }).sort({ createdAt: -1 }).limit(4);
    const homepageHero = await Content.findOne({ key: 'homepage-hero', isActive: true });
    const homepageServices = await Content.findOne({ key: 'homepage-services', isActive: true });
    const homepageCredentials = await Content.findOne({ key: 'homepage-credentials', isActive: true });

    res.render('index', {
      travelPackages,
      hajjPackages,
      workPackages,
      homepageHero,
      homepageServices,
      homepageCredentials,
      activePage: 'home'
    });
  } catch (error) {
    console.error('Error rendering index:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/travel', async (req, res) => {
  try {
    const packages = await TravelPackage.find({ isActive: true }).sort({ createdAt: -1 });
    res.render('travel', { packages, activePage: 'travel' });
  } catch (error) {
    console.error('Error rendering travel page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/hajj', async (req, res) => {
  try {
    const packages = await HajjPackage.find({ isActive: true }).sort({ createdAt: -1 });
    res.render('hajj', { packages, activePage: 'hajj' });
  } catch (error) {
    console.error('Error rendering hajj page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/work', async (req, res) => {
  try {
    const packages = await WorkPackage.find({ isActive: true }).sort({ createdAt: -1 });
    res.render('work', { packages, activePage: 'work' });
  } catch (error) {
    console.error('Error rendering work page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/travel/:id', async (req, res) => {
  try {
    const pkg = await TravelPackage.findById(req.params.id);
    if (!pkg) return res.status(404).send('Package not found');
    res.render('travel-detail', { pkg, activePage: 'travel' });
  } catch (error) {
    console.error('Error rendering travel detail:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/hajj/:id', async (req, res) => {
  try {
    const pkg = await HajjPackage.findById(req.params.id);
    if (!pkg) return res.status(404).send('Package not found');
    res.render('hajj-detail', { pkg, activePage: 'hajj' });
  } catch (error) {
    console.error('Error rendering hajj detail:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/work/:id', async (req, res) => {
  try {
    const pkg = await WorkPackage.findById(req.params.id);
    if (!pkg) return res.status(404).send('Package not found');
    res.render('work-detail', { pkg, activePage: 'work' });
  } catch (error) {
    console.error('Error rendering work detail:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('*', (req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
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
  process.exit(0);
});

module.exports = app;

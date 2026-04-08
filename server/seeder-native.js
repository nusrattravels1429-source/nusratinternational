require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGODB_URI;

// Sample travel packages
const travelPackages = [
  {
    title: { en: "Cox's Bazar Tour", bn: "কক্স বাজার ট্যুর" },
    description: { en: "Beautiful beach destination - world's longest sea beach", bn: "সুন্দর সমুদ্র তীরের গন্তব্য - বিশ্বের দীর্ঘতম সমুদ্র সৈকত" },
    price: 15000,
    duration: "3 days",
    category: "travel",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Hotel Stay", "Transport", "Guide", "Meals"],
    included: ["Accommodation", "Breakfast & Dinner", "Sightseeing", "Transport"],
    slug: "coxs-bazar-tour",
    isFeatured: true,
    rating: 4.8,
    details: {
      itinerary: [
        "Day 1: Departure from Dhaka, check-in at hotel, evening at Laboni Beach",
        "Day 2: Visit Himchari, Inani Beach, Sonadia Island tour",
        "Day 3: Shopping at local markets, departure to Dhaka"
      ],
      accommodation: "3-star hotel near Laboni Beach",
      transportation: "AC Bus/Car",
      guide: "Professional tour guide"
    }
  },
  {
    title: { en: "Sylhet Tea Garden Tour", bn: "সিলেট চা বাগান ট্যুর" },
    description: { en: "Explore beautiful tea gardens and natural beauty", bn: "সুন্দর চা বাগান এবং প্রাকৃতিক সৌন্দর্য এক্সপ্লোর করুন" },
    price: 12000,
    duration: "2 days",
    category: "travel",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Tea Garden Visit", "Local Food", "Cultural Experience", "Boat Ride"],
    included: ["Accommodation", "Breakfast", "Tour Guide", "Entry Fees"],
    slug: "sylhet-tea-garden",
    isFeatured: true,
    rating: 4.7,
    details: {
      itinerary: [
        "Day 1: Visit Ratargul Swamp Forest, Lalakhal boat ride",
        "Day 2: Tea garden tour, Jaflong visit, return to Dhaka"
      ]
    }
  },
  {
    title: { en: "Bandarban Hill Tract", bn: "বান্দরবান পাহাড়" },
    description: { en: "Experience hill tracts and tribal culture", bn: "পাহাড়ি এলাকা এবং উপজাতি সংস্কৃতি উপভোগ করুন" },
    price: 18000,
    duration: "4 days",
    category: "travel",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Trekking", "Tribal Village Visit", "Waterfall Hopping", "Camping"],
    included: ["Accommodation", "All Meals", "Transport", "Guide"],
    slug: "bandarban-hill-tract",
    isFeatured: true,
    rating: 4.9,
    details: {
      itinerary: [
        "Day 1: Reach Bandarban, visit Buddhist temples",
        "Day 2: Trek to Nilgiri, enjoy mountain views",
        "Day 3: Visit tribal villages, waterfalls",
        "Day 4: Return journey to Dhaka"
      ]
    }
  },
  {
    title: { en: "Saint Martin Island", bn: "সেন্ট মার্টিন দ্বীপ" },
    description: { en: "Beautiful coral island getaway in Bay of Bengal", bn: "বঙ্গোপসাগরে সুন্দর প্রবাল দ্বীপ ভ্রমণ" },
    price: 20000,
    duration: "3 days",
    category: "travel",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Island Tour", "Snorkeling", "Beach Activities", "Fresh Seafood"],
    included: ["Ferry Ticket", "Accommodation", "All Meals", "Guide"],
    slug: "saint-martin-island",
    isFeatured: true,
    rating: 4.9,
    details: {
      itinerary: [
        "Day 1: Ferry to Saint Martin, check-in, beach time",
        "Day 2: Island tour, snorkeling, Chera Dwip visit",
        "Day 3: Morning beach time, return ferry to Teknaf"
      ]
    }
  },
  {
    title: { en: "Kuakata Beach", bn: "কুয়াকাটা সমুদ্র সৈকত" },
    description: { en: "Watch both sunrise and sunset from the beach", bn: "সমুদ্র সৈকত থেকে সূর্যোদয় ও সূর্যাস্ত দেখুন" },
    price: 16000,
    duration: "3 days",
    category: "travel",
    image: "https://images.unsplash.com/photo-1506929562879-3892893ec18c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Sunrise & Sunset View", "Beach Activities", "Fishing", "Local Culture"],
    included: ["Accommodation", "Meals", "Boat Ride", "Guide"],
    slug: "kuakata-beach",
    isFeatured: true,
    rating: 4.6,
    details: {
      itinerary: [
        "Day 1: Reach Kuakata, evening beach walk",
        "Day 2: Sunrise view, boat ride, fishing village visit",
        "Day 3: Sunset view, return journey"
      ]
    }
  }
];

// Hajj & Umrah packages
const hajjPackages = [
  {
    title: { en: "Economy Hajj Package", bn: "অর্থনৈতিক হজ প্যাকেজ" },
    description: { en: "Affordable Hajj package with basic facilities near Haram", bn: "হারামের কাছে মৌলিক সুবিধা সহ সাশ্রয়ী হজ প্যাকেজ" },
    price: 450000,
    duration: "20 days",
    category: "hajj",
    image: "https://images.unsplash.com/photo-1588804666405-b4cd1fbf7b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Basic Accommodation", "Group Meals", "Transportation", "Visa Processing"],
    included: ["Flight Ticket", "Visa Processing", "Guidance", "Zamzam Water", "Travel Insurance"],
    slug: "economy-hajj-package",
    isFeatured: true,
    rating: 4.7,
    details: {
      programme: [
        "Pre-Hajj orientation and training",
        "Flight to Jeddah, transfer to Makkah",
        "Umrah before Hajj season",
        "Hajj rituals (8th-13th Dhul Hijjah)",
        "Return to Makkah for farewell Tawaf",
        "Visit Madinah (optional)",
        "Return flight to Bangladesh"
      ],
      accommodation: "3-star hotel, 800m from Haram",
      transportation: "AC Bus for all transfers"
    }
  },
  {
    title: { en: "Premium Umrah Ramadan", bn: "প্রিমিয়াম উমরা রমজান" },
    description: { en: "Luxury Umrah package during Ramadan with 5-star hotels", bn: "রমজান মাসে ৫ তারকা হোটেল সহ লাক্সারি উমরা প্যাকেজ" },
    price: 250000,
    duration: "15 days",
    category: "umrah",
    image: "https://images.unsplash.com/photo-1565551968899-e5f8aae28787?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["5 Star Hotel", "Private Transportation", "VIP Services", "Iftar & Suhoor"],
    included: ["Flight Ticket", "Visa Processing", "Premium Meals", "Guidance", "Insurance"],
    slug: "premium-umrah-ramadan",
    isFeatured: true,
    rating: 4.9,
    details: {
      programme: [
        "Departure from Dhaka",
        "Check-in at 5-star hotel in Makkah",
        "Umrah performance with guide",
        "Ramadan prayers at Haram",
        "Iftar and Suhoor arrangements",
        "Visit to Madinah (5 days)",
        "Return to Bangladesh"
      ],
      accommodation: "5-star hotel, Haram view rooms",
      transportation: "Private GMC/Savana"
    }
  },
  {
    title: { en: "Standard Hajj Package", bn: "প্রমিত হজ প্যাকেজ" },
    description: { en: "Comfortable Hajj journey with good facilities", bn: "ভাল সুবিধা সহ আরামদায়ক হজ যাত্রা" },
    price: 550000,
    duration: "20 days",
    category: "hajj",
    image: "https://images.unsplash.com/photo-1542044800-faba4a25c6f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Comfortable Hotel", "Quality Meals", "Experienced Guide", "Group Support"],
    included: ["Flight Ticket", "Visa Processing", "All Meals", "Guidance", "Medical Support"],
    slug: "standard-hajj-package",
    isFeatured: true,
    rating: 4.8,
    details: {
      programme: [
        "Pre-departure briefing",
        "Direct flight to Jeddah",
        "Check-in at Makkah hotel",
        "Perform Umrah",
        "Complete Hajj rituals",
        "Farewell Tawaf",
        "Ziyarat in Madinah",
        "Return to Bangladesh"
      ],
      accommodation: "4-star hotel, 500m from Haram",
      transportation: "AC Bus with experienced driver"
    }
  },
  {
    title: { en: "Budget Umrah Package", bn: "বাজেট উমরা প্যাকেজ" },
    description: { en: "Affordable Umrah for first-time pilgrims", bn: "প্রথমবারের তীর্থযাত্রীদের জন্য সাশ্রয়ী উমরা" },
    price: 120000,
    duration: "10 days",
    category: "umrah",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Economy Hotel", "Basic Meals", "Group Transportation", "Visa Support"],
    included: ["Flight Ticket", "Visa Processing", "Accommodation", "Basic Guidance"],
    slug: "budget-umrah-package",
    isFeatured: true,
    rating: 4.5,
    details: {
      programme: [
        "Flight to Jeddah",
        "Transfer to Makkah",
        "Umrah with group guide",
        "Free time for personal worship",
        "Optional Madinah visit",
        "Return flight"
      ],
      accommodation: "2-3 star hotel, 1km from Haram",
      transportation: "Shared bus service"
    }
  }
];

// Work packages
const workPackages = [
  {
    title: { en: "Driver Job Saudi Arabia", bn: "ড্রাইভার চাকরি সৌদি আরব" },
    description: { en: "Professional driver position with good salary and benefits", bn: "ভাল বেতন ও সুবিধা সহ পেশাদার ড্রাইভার পদ" },
    salary: 25000,
    duration: "2 years",
    category: "work",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Air Ticket Provided", "Accommodation", "Medical Insurance", "Annual Bonus"],
    included: ["Work Visa", "Training", "Support", "Contract Attestation"],
    slug: "driver-job-saudi-arabia",
    isFeatured: true,
    rating: 4.6,
    details: {
      sectors: ["Transportation", "Logistics"],
      contractDuration: "2 years (renewable)",
      requirements: [
        "Valid driving license (Bangladesh or International)",
        "Minimum 2 years driving experience",
        "Age: 25-45 years",
        "Basic English communication skills",
        "Good health certificate"
      ],
      applicationProcess: [
        "Submit application with documents",
        "Initial screening interview",
        "Driving test",
        "Medical examination",
        "Visa processing",
        "Pre-departure training",
        "Flight to Saudi Arabia"
      ]
    }
  },
  {
    title: { en: "Electrician Job UAE", bn: "ইলেকট্রিশিয়ান চাকরি ইউএই" },
    description: { en: "Skilled electrician position in Dubai/Abu Dhabi", bn: "দুবাই/আবুধাবিতে দক্ষ ইলেকট্রিশিয়ান পদ" },
    salary: 35000,
    duration: "3 years",
    category: "work",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["High Salary", "Accommodation", "Family Visa After 1 Year", "Overtime Pay"],
    included: ["Work Permit", "Training", "Insurance", "Annual Air Ticket"],
    slug: "electrician-job-uae",
    isFeatured: true,
    rating: 4.8,
    details: {
      sectors: ["Construction", "Maintenance", "Industrial"],
      contractDuration: "3 years",
      requirements: [
        "Diploma/Certificate in Electrical Engineering",
        "Minimum 3 years experience",
        "Knowledge of UAE electrical standards",
        "Age: 23-40 years",
        "Good physical fitness"
      ],
      applicationProcess: [
        "Online application",
        "Technical interview",
        "Practical test",
        "Document verification",
        "Medical test",
        "Emirates ID processing",
        "Deployment"
      ]
    }
  },
  {
    title: { en: "Construction Worker Qatar", bn: "নির্মাণ শ্রমিক কাতার" },
    description: { en: "Construction opportunities for FIFA infrastructure projects", bn: "ফিফা অবকাঠামো প্রকল্পের জন্য নির্মাণ কাজের সুযোগ" },
    salary: 22000,
    duration: "2 years",
    category: "work",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Good Salary", "Food Provided", "Transportation", "Safety Training"],
    included: ["Work Visa", "Safety Training", "Medical Checkup", "Uniform"],
    slug: "construction-worker-qatar",
    isFeatured: true,
    rating: 4.5,
    details: {
      sectors: ["Construction", "Infrastructure"],
      contractDuration: "2 years",
      requirements: [
        "Previous construction experience preferred",
        "Age: 21-45 years",
        "Physically fit",
        "Willing to work outdoors",
        "No criminal record"
      ],
      applicationProcess: [
        "Application submission",
        "Basic interview",
        "Physical fitness test",
        "Medical examination",
        "Qatar visa processing",
        "Safety orientation",
        "Flight to Qatar"
      ]
    }
  },
  {
    title: { en: "Chef Position Kuwait", bn: "রান্নাঘর কর্মী কুয়েত" },
    description: { en: "Experienced chef needed for 5-star hotels", bn: "৫ তারকা হোটেলের জন্য অভিজ্ঞ শেফ প্রয়োজন" },
    salary: 40000,
    duration: "2 years",
    category: "work",
    image: "https://images.unsplash.com/photo-1577106263724-828997e1d4a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Premium Salary", "5 Star Hotel", "Tips Included", "Career Growth"],
    included: ["Work Visa", "Cooking Training", "Uniform", "Accommodation"],
    slug: "chef-position-kuwait",
    isFeatured: true,
    rating: 4.7,
    details: {
      sectors: ["Hospitality", "Food Service"],
      contractDuration: "2 years",
      requirements: [
        "Culinary degree or equivalent experience",
        "Minimum 5 years as chef",
        "Knowledge of international cuisines",
        "Age: 25-45 years",
        "Food safety certification"
      ],
      applicationProcess: [
        "Submit CV and portfolio",
        "Cooking demonstration",
        "Interview with hotel management",
        "Reference check",
        "Medical test",
        "Kuwait work permit",
        "Joining"
      ]
    }
  },
  {
    title: { en: "Sales Executive Oman", bn: "বিক্রয় কর্মকর্তা ওমান" },
    description: { en: "Sales position with commission and incentives", bn: "কমিশন ও ইনসেনটিভ সহ বিক্রয় পদ" },
    salary: 30000,
    duration: "2 years",
    category: "work",
    image: "https://images.unsplash.com/photo-1556761229-9632378a1e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [],
    features: ["Commission Based", "Office Space", "Company Car", "Performance Bonus"],
    included: ["Work Visa", "Sales Training", "Insurance", "Mobile Allowance"],
    slug: "sales-executive-oman",
    isFeatured: true,
    rating: 4.6,
    details: {
      sectors: ["Retail", "B2B Sales"],
      contractDuration: "2 years",
      requirements: [
        "Bachelor's degree in Business/Marketing",
        "Minimum 2 years sales experience",
        "Good communication skills",
        "Age: 23-40 years",
        "Computer literate"
      ],
      applicationProcess: [
        "Online application",
        "HR interview",
        "Role play assessment",
        "Background verification",
        "Medical test",
        "Oman visa",
        "Induction program"
      ]
    }
  }
];

// Homepage content
const homepageContent = {
  heroSlides: [
    {
      title: { en: "Travel to Beautiful Places", bn: "সুন্দর জায়গায় ভ্রমণ করুন" },
      subtitle: { en: "Discover amazing destinations around Bangladesh", bn: "বাংলাদেশের চারপাশে অসাধারণ গন্তব্য খুঁজুন" },
      image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: { en: "Hajj & Umrah Services", bn: "হজ ও উমরা পরিষেবা" },
      subtitle: { en: "Complete assistance for your sacred journey", bn: "আপনার পবিত্র যাত্রার জন্য সম্পূর্ণ সহায়তা" },
      image: "https://images.unsplash.com/photo-1588804666405-b4cd1fbf7b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: { en: "Work Opportunities Abroad", bn: "বিদেশে চাকরির সুযোগ" },
      subtitle: { en: "Find your dream job in Gulf countries", bn: "গালফ দেশগুলোতে আপনার স্বপ্নের চাকরি খুঁজুন" },
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ],
  certifications: [
    { name: { en: "BAIRA Member", bn: "বায়াইরা সদস্য" }, description: "Bangladesh Association of International Recruiting Agencies", tag: "Manpower Recruiting", logo: "https://www.baira.org.bd/assets/public/images/profile.jpg" },
    { name: { en: "IATA Accredited", bn: "আইএটিএ অনুমোদিত" }, description: "International Air Transport Association", tag: "Aviation & Travel", logo: "https://logowik.com/content/uploads/images/t_542_iata.jpg" },
    { name: { en: "ATAB Member", bn: "এটাব সদস্য" }, description: "Association of Travel Agents of Bangladesh", tag: "Travel Agency", logo: "https://www.tbsnews.net/sites/default/files/styles/big_2/public/images/2022/01/13/atab.jpg" }
  ],
  countries: [
    { name: { en: "Saudi Arabia", bn: "সৌদি আরব" }, flag: "🇸🇦" },
    { name: { en: "United Arab Emirates", bn: "সংযুক্ত আরব আমিরাত" }, flag: "🇦🇪" },
    { name: { en: "Qatar", bn: "কাতার" }, flag: "🇶🇦" },
    { name: { en: "Kuwait", bn: "কুয়েত" }, flag: "🇰🇼" },
    { name: { en: "Oman", bn: "ওমান" }, flag: "🇴🇲" },
    { name: { en: "Bahrain", bn: "বাহরাইন" }, flag: "🇧🇭" }
  ]
};

async function seedDatabase() {
  if (!MONGO_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }

  let client;
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('nusrat_travels');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('packages').deleteMany({});
    await db.collection('homepage_content').deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Insert packages
    const allPackages = [...travelPackages, ...hajjPackages, ...workPackages];
    const result = await db.collection('packages').insertMany(allPackages);
    console.log(`✅ Inserted ${result.insertedCount} packages`);
    console.log(`   - ${travelPackages.length} travel packages`);
    console.log(`   - ${hajjPackages.length} hajj/umrah packages`);
    console.log(`   - ${workPackages.length} work packages`);
    
    // Insert homepage content
    const homeResult = await db.collection('homepage_content').insertOne(homepageContent);
    console.log('✅ Inserted homepage content');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   Total packages: ${allPackages.length}`);
    console.log(`   Featured packages: ${allPackages.filter(p => p.isFeatured).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.message.includes('IP whitelist')) {
      console.log('\n⚠️  IMPORTANT: You need to add your IP address to MongoDB Atlas whitelist:');
      console.log('   1. Go to https://cloud.mongodb.com');
      console.log('   2. Navigate to Network Access');
      console.log('   3. Click "Add IP Address"');
      console.log('   4. Choose "Allow Access from Anywhere" (0.0.0.0/0) OR add your current IP');
      console.log('   5. Wait 1-2 minutes for changes to propagate');
      console.log('   6. Run this script again\n');
    }
    process.exit(1);
  } finally {
    if (client) await client.close();
    process.exit(0);
  }
}

seedDatabase();

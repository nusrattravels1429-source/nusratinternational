const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./models/Package');
const Homepage = require('./models/Homepage');

// Fake Travel Packages Data
const travelPackages = [
  {
    title: { en: "Cox's Bazar Beach Tour", bn: "কক্স বাজার সমুদ্র সৈকত ট্যুর" },
    description: { en: "Experience the world's longest natural sea beach with golden sands and beautiful sunsets.", bn: "বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকতে স্বর্ণালী বালি এবং সুন্দর সূর্যাস্ত উপভোগ করুন।" },
    category: 'travel',
    price: 12500,
    duration: '3 Days 2 Nights',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
    ],
    features: ['Sea Beach Visit', 'Himchori Waterfall', 'Inani Beach Tour', 'Local Seafood'],
    included: ['AC Bus Transport', 'Hotel Accommodation', 'Breakfast & Dinner', 'Professional Guide'],
    slug: 'cox-bazar-beach-tour',
    isFeatured: true,
    rating: 4.8,
    details: {
      itinerary: [
        'Day 1: Departure from Dhaka, Check-in at Hotel, Evening Beach Walk',
        'Day 2: Himchori Waterfall, Inani Beach, Coral Reef Visit',
        'Day 3: Morning Market Visit, Return to Dhaka'
      ],
      accommodation: '3-Star Hotel with Sea View',
      transportation: 'AC Coach Bus',
      guide: 'Experienced Local Guide'
    }
  },
  {
    title: { en: "Sylhet Tea Garden Tour", bn: "সিলেট চা বাগান ট্যুর" },
    description: { en: "Explore the lush green tea gardens and scenic beauty of Sylhet region.", bn: "সিলেট অঞ্চলের সবুজ চা বাগান এবং প্রাকৃতিক সৌন্দর্য উপভোগ করুন।" },
    category: 'travel',
    price: 15000,
    duration: '4 Days 3 Nights',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
      'https://images.unsplash.com/photo-1565118531796-763e18f0a6f5?w=800&q=80'
    ],
    features: ['Tea Garden Visit', 'Ratargul Swamp Forest', 'Jaflong Stone Collection', 'Traditional Village Tour'],
    included: ['Luxury Bus Transport', 'Resort Accommodation', 'All Meals', 'Boat Ride'],
    slug: 'sylhet-tea-garden-tour',
    isFeatured: true,
    rating: 4.7,
    details: {
      itinerary: [
        'Day 1: Dhaka to Sylhet, Check-in at Resort',
        'Day 2: Tea Garden Tour, Traditional Village Visit',
        'Day 3: Ratargul Swamp Forest, Jaflong',
        'Day 4: Morning Leisure, Return to Dhaka'
      ],
      accommodation: 'Eco Resort in Tea Garden',
      transportation: 'Luxury Bus with AC',
      guide: 'Nature Expert Guide'
    }
  },
  {
    title: { en: "Saint Martin Island Adventure", bn: "সেন্ট মার্টিন দ্বীপ অভিযান" },
    description: { en: "Visit the only coral island of Bangladesh with crystal clear blue water.", bn: "বাংলাদেশের একমাত্র প্রবাল দ্বীপে স্ফটিক স্বচ্ছ নীল পানি উপভোগ করুন।" },
    category: 'travel',
    price: 22000,
    duration: '3 Days 2 Nights',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
    ],
    features: ['Coral Island Tour', 'Snorkeling', 'Beach Camping', 'Fresh Seafood'],
    included: ['Launch Ticket', 'Tent Accommodation', 'All Meals', 'Snorkeling Equipment'],
    slug: 'saint-martin-island-adventure',
    isFeatured: true,
    rating: 4.9,
    details: {
      itinerary: [
        'Day 1: Launch from Teknaf, Check-in at Camp, Beach Activities',
        'Day 2: Full Island Tour, Snorkeling, Sunset Viewing',
        'Day 3: Morning Swimming, Return to Teknaf'
      ],
      accommodation: 'Beach Tent with Facilities',
      transportation: 'Speed Launch',
      guide: 'Marine Life Expert'
    }
  },
  {
    title: { en: "Bandarban Hill Tract Tour", bn: "বান্দরবান পাহাড় ট্যুর" },
    description: { en: "Discover the highest peaks and tribal culture of Bandarban hill district.", bn: "বান্দরবান পার্বত্য জেলার সর্বোচ্চ শৃঙ্গ এবং উপজাতি সংস্কৃতি আবিষ্কার করুন।" },
    category: 'travel',
    price: 18500,
    duration: '4 Days 3 Nights',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
      'https://images.unsplash.com/photo-1533587851505-d119988a7915?w=800&q=80'
    ],
    features: ['Keokradong Trek', 'Tribal Village Visit', 'Waterfall Hopping', 'Traditional Food'],
    included: ['Jeep Transport', 'Guest House Stay', 'All Meals', 'Trekking Guide'],
    slug: 'bandarban-hill-tract-tour',
    isFeatured: false,
    rating: 4.6,
    details: {
      itinerary: [
        'Day 1: Dhaka to Bandarban, Check-in at Guest House',
        'Day 2: Keokradong Base Camp Trek',
        'Day 3: Tribal Village Tour, Waterfall Visit',
        'Day 4: Morning Market, Return Journey'
      ],
      accommodation: 'Mountain Guest House',
      transportation: '4WD Jeep',
      guide: 'Trekking Specialist'
    }
  },
  {
    title: { en: "Kuakata Sunrise Beach", bn: "কুয়াকাটা সূর্যোদয় সৈকত" },
    description: { en: "Witness the unique sunrise and sunset from the same beach in Kuakata.", bn: "কুয়াকাটায় একই সৈকত থেকে অনন্য সূর্যোদয় ও সূর্যাস্ত উপভোগ করুন।" },
    category: 'travel',
    price: 14000,
    duration: '3 Days 2 Nights',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
    ],
    features: ['Sunrise & Sunset View', 'Fishing Experience', 'Temple Visit', 'Local Market'],
    included: ['Bus Transport', 'Hotel Stay', 'Breakfast & Dinner', 'Boat Ride'],
    slug: 'kuakata-sunrise-beach',
    isFeatured: false,
    rating: 4.5,
    details: {
      itinerary: [
        'Day 1: Departure to Kuakata, Check-in, Evening Beach',
        'Day 2: Sunrise View, Fishing Trip, Temple Visit',
        'Day 3: Local Market, Return to Dhaka'
      ],
      accommodation: 'Beach Front Hotel',
      transportation: 'AC Bus',
      guide: 'Local Cultural Guide'
    }
  }
];

// Fake Hajj Packages Data
const hajjPackages = [
  {
    title: { en: "Economy Hajj Package 2024", bn: "অর্থনৈতিক হজ প্যাকেজ ২০২৪" },
    description: { en: "Affordable Hajj package with essential services for spiritual journey.", bn: "আধ্যাত্মিক যাত্রার জন্য প্রয়োজনীয় সেবাসহ সাশ্রয়ী হজ প্যাকেজ।" },
    category: 'hajj',
    price: 450000,
    duration: '21 Days',
    image: 'https://images.unsplash.com/photo-1565552629477-cdcb4d3f4e5b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565552629477-cdcb4d3f4e5b?w=800&q=80',
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80'
    ],
    features: ['Visa Processing', 'Flight Ticket', 'Makkah Hotel', 'Madinah Hotel', 'Ziyarat Tours'],
    included: ['Saudi Visa', 'Air Ticket', '5 Star Hotels', 'All Meals', 'Transportation', 'Group Leader'],
    slug: 'economy-hajj-package-2024',
    isFeatured: true,
    rating: 4.7,
    details: {
      programme: [
        'Ihram Training Session',
        'Hajj Rituals Guidance',
        'Daily Prayer Arrangements',
        'Ziyarat in Makkah & Madinah'
      ],
      accommodation: '5 Star Hotel near Haram (800m)',
      transportation: 'AC Bus for All Transfers',
      guide: 'Experienced Hajj Group Leader'
    }
  },
  {
    title: { en: "Premium Hajj Package 2024", bn: "প্রিমিয়াম হজ প্যাকেজ ২০২৪" },
    description: { en: "Luxury Hajj experience with premium hotels and VIP services.", bn: "প্রিমিয়াম হোটেল এবং ভিআইপি সেবাসহ বিলাসবহুল হজ অভিজ্ঞতা।" },
    category: 'hajj',
    price: 650000,
    duration: '21 Days',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
      'https://images.unsplash.com/photo-1565552629477-cdcb4d3f4e5b?w=800&q=80'
    ],
    features: ['VIP Visa', 'Direct Flight', 'Clock Tower Hotel', 'Buffet Meals', 'Private Transport'],
    included: ['VIP Saudi Visa', 'Direct Flight', 'Clock Tower Hotel', 'International Buffet', 'Private Car', 'Scholar Guide'],
    slug: 'premium-hajj-package-2024',
    isFeatured: true,
    rating: 4.9,
    details: {
      programme: [
        'Pre-Hajj Training by Scholar',
        'Personalized Ritual Guidance',
        'Priority Prayer Arrangements',
        'Exclusive Ziyarat Tours'
      ],
      accommodation: '5 Star Clock Tower Hotel (200m)',
      transportation: 'Private Luxury Car',
      guide: 'Islamic Scholar as Guide'
    }
  },
  {
    title: { en: "Standard Umrah Package", bn: "স্ট্যান্ডার্ড উমরা প্যাকেজ" },
    description: { en: "Complete Umrah package with comfortable accommodation and guidance.", bn: "আরামদায়ক আবাসন এবং নির্দেশনাসহ সম্পূর্ণ উমরা প্যাকেজ।" },
    category: 'umrah',
    price: 185000,
    duration: '15 Days',
    image: 'https://images.unsplash.com/photo-1564769624456-f8c8b7a5c5e9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1564769624456-f8c8b7a5c5e9?w=800&q=80'
    ],
    features: ['Umrah Visa', 'Flight Ticket', 'Hotel Near Haram', 'Ziyarat Tours'],
    included: ['Saudi Visa', 'Air Ticket', '4 Star Hotels', 'Breakfast', 'Transportation', 'Guide'],
    slug: 'standard-umrah-package',
    isFeatured: true,
    rating: 4.6,
    details: {
      programme: [
        'Umrah Training Session',
        'Daily Prayer Guidance',
        'Ziyarat in Makkah & Madinah'
      ],
      accommodation: '4 Star Hotel (500m from Haram)',
      transportation: 'AC Bus Service',
      guide: 'Experienced Group Leader'
    }
  },
  {
    title: { en: "Ramadan Umrah Special", bn: "রমজান উমরা বিশেষ" },
    description: { en: "Special Umrah package for last 10 days of Ramadan with extra blessings.", bn: "রমজানের শেষ ১০ দিনের জন্য বিশেষ উমরা প্যাকেজ অতিরিক্ত বরকত সহ।" },
    category: 'umrah',
    price: 275000,
    duration: '12 Days',
    image: 'https://images.unsplash.com/photo-1534068590799-09895a701e3e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1534068590799-09895a701e3e?w=800&q=80',
      'https://images.unsplash.com/photo-1565552629477-cdcb4d3f4e5b?w=800&q=80'
    ],
    features: ['Last 10 Days Ramadan', 'Iftar & Sehri', 'Premium Hotels', 'Taraweeh Prayer'],
    included: ['Saudi Visa', 'Air Ticket', '5 Star Hotels', 'Iftar & Sehri', 'Transportation', 'Scholar Guide'],
    slug: 'ramadan-umrah-special',
    isFeatured: true,
    rating: 4.8,
    details: {
      programme: [
        'Ramadan Spiritual Sessions',
        'Taraweeh Prayer Arrangement',
        'Laylatul Qadr Observance',
        'Special Dua Sessions'
      ],
      accommodation: '5 Star Hotel (300m from Haram)',
      transportation: 'AC Bus with Iftar Packets',
      guide: 'Islamic Scholar for Ramadan Guidance'
    }
  }
];

// Fake Work Packages Data
const workPackages = [
  {
    title: { en: "Driver Job in Saudi Arabia", bn: "সৌদি আরবে ড্রাইভার চাকরি" },
    description: { en: "Professional driver position with good salary and benefits in Riyadh.", bn: "রিয়াদে ভাল বেতন ও সুবিধাসহ পেশাদার ড্রাইভার পদ।" },
    category: 'work',
    price: 150000,
    duration: '2 Years Contract',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80'
    ],
    features: ['Salary 2500 SAR', 'Free Accommodation', 'Medical Insurance', 'Air Ticket'],
    included: ['Work Visa', 'Air Ticket', 'Accommodation', 'Medical Insurance', 'Training'],
    slug: 'driver-job-saudi-arabia',
    isFeatured: true,
    rating: 4.5,
    details: {
      salary: '2500 SAR per month',
      sectors: ['Transportation', 'Logistics'],
      contractDuration: '2 Years (Renewable)',
      applicationProcess: [
        'Submit Application',
        'Driving Test',
        'Medical Examination',
        'Visa Processing',
        'Pre-departure Training'
      ],
      requirements: ['Valid Driving License', '2 Years Experience', 'Basic English', 'Good Health']
    }
  },
  {
    title: { en: "Electrician Job in UAE", bn: "ইউএইতে ইলেকট্রিশিয়ান চাকরি" },
    description: { en: "Skilled electrician position in Dubai with excellent career growth.", bn: "দুবাইয়ে চমৎকার ক্যারিয়ার গ্রোথ সহ দক্ষ ইলেকট্রিশিয়ান পদ।" },
    category: 'work',
    price: 180000,
    duration: '3 Years Contract',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'
    ],
    features: ['Salary 3500 AED', 'Family Visa', 'Health Insurance', 'Annual Bonus'],
    included: ['Employment Visa', 'Air Ticket', 'Accommodation Allowance', 'Insurance', 'Training'],
    slug: 'electrician-job-uae',
    isFeatured: true,
    rating: 4.7,
    details: {
      salary: '3500 AED per month + Overtime',
      sectors: ['Construction', 'Maintenance', 'Industrial'],
      contractDuration: '3 Years (Renewable)',
      applicationProcess: [
        'Technical Assessment',
        'Interview',
        'Medical Test',
        'Visa Processing',
        'Safety Training'
      ],
      requirements: ['Diploma in Electrical', '3 Years Experience', 'DEWA Certificate Preferred', 'English Communication']
    }
  },
  {
    title: { en: "Construction Worker in Qatar", bn: "কাতারে নির্মাণ শ্রমিক" },
    description: { en: "Construction opportunities for World Cup infrastructure projects.", bn: "বিশ্বকাপ অবকাঠামো প্রকল্পের জন্য নির্মাণ সুযোগ।" },
    category: 'work',
    price: 120000,
    duration: '2 Years Contract',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
    ],
    features: ['Salary 1800 QAR', 'Free Food', 'Accommodation', 'Overtime Pay'],
    included: ['Work Permit', 'Air Ticket', 'Food & Accommodation', 'Medical', 'Safety Gear'],
    slug: 'construction-worker-qatar',
    isFeatured: false,
    rating: 4.3,
    details: {
      salary: '1800 QAR + Overtime',
      sectors: ['Building Construction', 'Road Works', 'Infrastructure'],
      contractDuration: '2 Years',
      applicationProcess: [
        'Application Submission',
        'Physical Fitness Test',
        'Medical Examination',
        'Visa Processing',
        'Safety Orientation'
      ],
      requirements: ['Physical Fitness', 'Construction Experience', 'Team Player', 'Willingness to Learn']
    }
  },
  {
    title: { en: "Chef Position in Kuwait", bn: "কুয়েতে শেফ পদ" },
    description: { en: "Professional chef opportunity in 5-star hotels in Kuwait City.", bn: "কুয়েত সিটির ৫-তারকা হোটেলে পেশাদার শেফ সুযোগ।" },
    category: 'work',
    price: 200000,
    duration: '2 Years Contract',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80'
    ],
    features: ['Salary 450 KWD', 'Tips Included', 'Staff Accommodation', 'Career Growth'],
    included: ['Work Visa', 'Air Ticket', 'Accommodation', 'Meals', 'Uniform', 'Training'],
    slug: 'chef-position-kuwait',
    isFeatured: true,
    rating: 4.6,
    details: {
      salary: '450 KWD + Tips (Approx 150,000 BDT)',
      sectors: ['Hotels', 'Restaurants', 'Catering'],
      contractDuration: '2 Years (Renewable)',
      applicationProcess: [
        'Cooking Demonstration',
        'Interview with Chef Manager',
        'Medical Test',
        'Visa Processing',
        'Kitchen Safety Training'
      ],
      requirements: ['Culinary Diploma', '5 Years Experience', 'Multi-cuisine Knowledge', 'Hygiene Certificate']
    }
  },
  {
    title: { en: "Sales Executive in Oman", bn: "ওমানে সেলস এক্সিকিউটিভ" },
    description: { en: "Sales executive position with commission basis in Muscat.", bn: "মাস্কাটে কমিশন ভিত্তিক সেলস এক্সিকিউটিভ পদ।" },
    category: 'work',
    price: 140000,
    duration: '2 Years Contract',
    image: 'https://images.unsplash.com/photo-1556761229-9632378a1e68?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556761229-9632378a1e68?w=800&q=80'
    ],
    features: ['Salary 300 OMR', 'Commission', 'Company Car', 'Performance Bonus'],
    included: ['Employment Visa', 'Air Ticket', 'Accommodation Allowance', 'Insurance', 'Training'],
    slug: 'sales-executive-oman',
    isFeatured: false,
    rating: 4.4,
    details: {
      salary: '300 OMR + Commission (Up to 500 OMR)',
      sectors: ['Retail', 'B2B Sales', 'Real Estate'],
      contractDuration: '2 Years',
      applicationProcess: [
        'Resume Screening',
        'Sales Assessment',
        'Interview',
        'Reference Check',
        'Visa Processing'
      ],
      requirements: ['Bachelor Degree', 'Sales Experience', 'Communication Skills', 'Driving License']
    }
  },
  {
    title: { en: "Mechanic Job in Bahrain", bn: "বাহরাইনে মেকানিক চাকরি" },
    description: { en: "Auto mechanic position in leading garage in Manama.", bn: "মানামার লিডিং গ্যারেজে অটো মেকানিক পদ।" },
    category: 'work',
    price: 160000,
    duration: '2 Years Contract',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80'
    ],
    features: ['Salary 350 BHD', 'Free Accommodation', 'Transportation', 'Annual Ticket'],
    included: ['Work Permit', 'Air Ticket', 'Accommodation', 'Medical Insurance', 'Tools Provided'],
    slug: 'mechanic-job-bahrain',
    isFeatured: false,
    rating: 4.5,
    details: {
      salary: '350 BHD per month',
      sectors: ['Automotive', 'Heavy Machinery', 'Maintenance'],
      contractDuration: '2 Years (Renewable)',
      applicationProcess: [
        'Technical Test',
        'Practical Demonstration',
        'Interview',
        'Medical Checkup',
        'Visa Processing'
      ],
      requirements: ['Mechanic Diploma', '4 Years Experience', 'Multiple Brand Knowledge', 'Problem Solving Skills']
    }
  }
];

// Fake Homepage Content
const homepageContent = {
  heroSlides: [
    {
      title: { en: "Discover Beautiful Bangladesh", bn: "সুন্দর বাংলাদেশ আবিষ্কার করুন" },
      subtitle: { en: "Explore the natural beauty of Cox's Bazar, Sylhet, and Saint Martin", bn: "কক্স বাজার, সিলেট এবং সেন্ট মার্টিনের প্রাকৃতিক সৌন্দর্য উপভোগ করুন" },
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
      link: '/pages/Travel.html'
    },
    {
      title: { en: "Sacred Hajj & Umrah Journey", bn: "পবিত্র হজ ও উমরা যাত্রা" },
      subtitle: { en: "Complete assistance for your spiritual pilgrimage to Makkah & Madinah", bn: "মক্কা ও মদিনায় আপনার আধ্যাত্মিক তীর্থযাত্রার জন্য সম্পূর্ণ সহায়তা" },
      image: 'https://images.unsplash.com/photo-1565552629477-cdcb4d3f4e5b?w=1200&q=80',
      link: '/pages/Hajj.html'
    },
    {
      title: { en: "Work Opportunities Abroad", bn: "বিদেশে চাকরির সুযোগ" },
      subtitle: { en: "Build your career in Gulf countries with verified employers", bn: "যাচাইকৃত নিয়োগকর্তাদের সাথে গালফ দেশগুলোতে আপনার ক্যারিয়ার গড়ুন" },
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
      link: '/pages/Work.html'
    }
  ],
  certifications: [
    { name: { en: "Ministry of Tourism Approved", bn: "পর্যটন মন্ত্রণালয় অনুমোদিত" }, number: "TOUR/2023/1234", logo: "" },
    { name: { en: "Ministry of Expatriates Licensed", bn: "প্রবাসী কল্যাণ মন্ত্রণালয় লাইসেন্সপ্রাপ্ত" }, number: "EXP/2023/5678", logo: "" },
    { name: { en: "Saudi Embassy Authorized", bn: "সৌদি দূতাবাস অনুমোদিত" }, number: "SAU/2023/9012", logo: "" },
    { name: { en: "IATA Certified", bn: "আইএটিএ সার্টিফাইড" }, number: "IATA/2023/3456", logo: "" }
  ],
  countries: [
    { name: { en: "Saudi Arabia", bn: "সৌদি আরব" }, flag: "🇸🇦", code: "SA" },
    { name: { en: "United Arab Emirates", bn: "সংযুক্ত আরব আমিরাত" }, flag: "🇦🇪", code: "AE" },
    { name: { en: "Qatar", bn: "কাতার" }, flag: "🇶🇦", code: "QA" },
    { name: { en: "Kuwait", bn: "কুয়েত" }, flag: "🇰🇼", code: "KW" },
    { name: { en: "Oman", bn: "ওমান" }, flag: "🇴🇲", code: "OM" },
    { name: { en: "Bahrain", bn: "বাহরাইন" }, flag: "🇧🇭", code: "BH" },
    { name: { en: "Malaysia", bn: "মালয়েশিয়া" }, flag: "🇲🇾", code: "MY" },
    { name: { en: "Singapore", bn: "সিঙ্গাপুর" }, flag: "🇸🇬", code: "SG" }
  ],
  about: {
    title: { en: "About Nusrat International", bn: "নূসরাত ইন্টারন্যাশনাল সম্পর্কে" },
    content: {
      en: "Nusrat International is a premier travel and recruitment agency established in 2010. We specialize in providing comprehensive services for Hajj & Umrah pilgrimages, domestic and international tourism, and overseas employment opportunities. With over 12 years of experience, we have successfully served more than 5,000 satisfied customers. Our commitment to excellence, transparency, and customer satisfaction has made us a trusted name in the industry.",
      bn: "নূসরাত ইন্টারন্যাশনাল ২০১০ সালে প্রতিষ্ঠিত একটি শীর্ষস্থানীয় ভ্রমণ ও নিয়োগ সংস্থা। আমরা হজ ও উমরা তীর্থযাত্রা, দেশি ও আন্তর্জাতিক পর্যটন এবং বিদেশে কর্মসংস্থানের সুযোগের জন্য ব্যাপক সেবা প্রদানে বিশেষজ্ঞ। ১২ বছরেরও বেশি অভিজ্ঞতার সাথে, আমরা ৫,০০০ এরও বেশি সন্তুষ্ট গ্রাহককে সফলভাবে সেবা দিয়েছি। উৎকর্ষতা, স্বচ্ছতা এবং গ্রাহক সন্তুষ্টির প্রতি আমাদের প্রতিশ্রুতি আমাদের শিল্পে একটি বিশ্বস্ত নাম করে তুলেছে।"
    },
    image: 'https://images.unsplash.com/photo-1521791136354-56280779abde?w=800&q=80'
  },
  stats: [
    { value: "5000+", label: { en: "Happy Customers", bn: "খুশি গ্রাহক" }, icon: "👥" },
    { value: "15+", label: { en: "Countries", bn: "দেশ" }, icon: "🌍" },
    { value: "1200+", label: { en: "Hajj/Umrah", bn: "হজ/উমরা" }, icon: "🕋" },
    { value: "12", label: { en: "Years Experience", bn: "বছর অভিজ্ঞতা" }, icon: "🏆" }
  ],
  featuredPackages: {
    travel: [],
    hajj: [],
    work: []
  },
  contactInfo: {
    phone: "+880 1XXX-XXXXXX",
    email: "info@nusratinternational.com",
    address: "House #XX, Road #XX, Dhanmondi, Dhaka-1209, Bangladesh",
    officeHours: "Saturday - Thursday: 9:00 AM - 6:00 PM"
  },
  socialMedia: {
    facebook: "https://facebook.com/nusratinternational",
    twitter: "https://twitter.com/nusratintl",
    instagram: "https://instagram.com/nusratinternational",
    youtube: "https://youtube.com/nusratinternational"
  }
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Package.deleteMany({});
    await Homepage.deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert Travel Packages
    console.log('📦 Inserting travel packages...');
    const insertedTravel = await Package.insertMany(travelPackages);
    console.log(`✅ Inserted ${insertedTravel.length} travel packages`);

    // Insert Hajj/Umrah Packages
    console.log('🕋 Inserting Hajj/Umrah packages...');
    const insertedHajj = await Package.insertMany(hajjPackages);
    console.log(`✅ Inserted ${insertedHajj.length} Hajj/Umrah packages`);

    // Insert Work Packages
    console.log('💼 Inserting work packages...');
    const insertedWork = await Package.insertMany(workPackages);
    console.log(`✅ Inserted ${insertedWork.length} work packages`);

    // Update featured packages IDs in homepage content
    homepageContent.featuredPackages.travel = insertedTravel.filter(p => p.isFeatured).map(p => p._id.toString());
    homepageContent.featuredPackages.hajj = insertedHajj.filter(p => p.isFeatured).map(p => p._id.toString());
    homepageContent.featuredPackages.work = insertedWork.filter(p => p.isFeatured).map(p => p._id.toString());

    // Insert Homepage Content
    console.log('🏠 Inserting homepage content...');
    await Homepage.create(homepageContent);
    console.log('✅ Homepage content inserted');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - Travel Packages: ${insertedTravel.length}`);
    console.log(`  - Hajj/Umrah Packages: ${insertedHajj.length}`);
    console.log(`  - Work Packages: ${insertedWork.length}`);
    console.log(`  - Homepage Content: 1`);
    console.log(`\nTotal Documents: ${insertedTravel.length + insertedHajj.length + insertedWork.length + 1}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();

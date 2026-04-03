const mongoose = require('mongoose');
require('dotenv').config();

const Card = require('./models/Card');

// Fake Cards Data - Travel/International Agency Packages
const cardsData = [
  {
    title: { en: "Cox's Bazar Beach Tour", bn: "কক্স বাজার সমুদ্র সৈকত ট্যুর" },
    description: { en: "Experience the world's longest natural sea beach with golden sands and beautiful sunsets.", bn: "বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকতে স্বর্ণালী বালি এবং সুন্দর সূর্যাস্ত উপভোগ করুন।" },
    category: 'travel',
    price: 12500,
    duration: '3 Days 2 Nights',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80'
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
    title: { en: "Premium Umrah Package", bn: "প্রিমিয়াম উমরা প্যাকেজ" },
    description: { en: "Luxury Umrah experience with premium hotels close to Haram.", bn: "হারামের কাছে প্রিমিয়াম হোটেল সহ বিলাসবহুল উমরা অভিজ্ঞতা।" },
    category: 'umrah',
    price: 275000,
    duration: '15 Days',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
      'https://images.unsplash.com/photo-1564769624456-f8c8b7a5c5e9?w=800&q=80'
    ],
    features: ['VIP Visa', 'Direct Flight', 'Clock Tower Hotel', 'Buffet Meals', 'Private Transport'],
    included: ['VIP Saudi Visa', 'Direct Flight', 'Clock Tower Hotel', 'International Buffet', 'Private Car', 'Scholar Guide'],
    slug: 'premium-umrah-package',
    isFeatured: true,
    rating: 4.9,
    details: {
      programme: [
        'Pre-Umrah Training by Scholar',
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
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing cards
    await Card.deleteMany({});
    console.log('🗑️  Cleared existing cards');

    // Insert new cards
    const insertedCards = await Card.insertMany(cardsData);
    console.log(`✅ Seeded ${insertedCards.length} cards successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();

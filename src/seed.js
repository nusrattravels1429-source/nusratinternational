require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URI;
if (!url) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

const connectDB = async () => {
  const client = new MongoClient(url);
  await client.connect();
  return client.db('nusrat_travels');
};

const seedDatabase = async () => {
  try {
    const db = await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await db.collection('travel_packages').deleteMany({});
    await db.collection('hajj_packages').deleteMany({});
    await db.collection('work_packages').deleteMany({});
    await db.collection('contents').deleteMany({});
    console.log('Cleared existing data');

    // Insert travel packages
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
        shortDescription_en: 'Whitewashed houses and magical sunsets over the Aegean Sea.',
        about_en: 'Experience the iconic blue-domed churches, cliffside sunsets, and a romantic Greek island escape. Includes flights, hotels, transfers and guided tours.',
        about_bn: 'প্রশান্ত এজিয়ান সাগরের তার তার সূর্যাস্ত, রোমান্টিক গ্রিক দ্বীপের অভিজ্ঞতা এবং  ফ্লাইট, হোটেল, ট্রান্সফার ও গাইডেড ট্যুর অন্তর্ভুক্ত।',
        highlights: [
          { icon: '🏖️', title: 'Private Beach Visit', subtitle: 'Relax by the sea', desc: 'Spend quality time on famous volcanic beaches.' },
          { icon: '🍷', title: 'Local Cuisine', subtitle: 'Greek dining', desc: 'Taste fresh seafood, salads, and island specialties.' },
          { icon: '🛥️', title: 'Island Cruise', subtitle: 'Aegean adventure', desc: 'Enjoy a sunset cruise around Santorini.' }
        ],
        programme: [
          { day: 1, title: 'Arrival in Athens', desc: 'Transfer to Santorini and relax in your hotel.' },
          { day: 2, title: 'Oia & Fira', desc: 'Explore cliffside towns and iconic blue domes.' },
          { day: 3, title: 'Island Tour', desc: 'Explore beaches, vineyards, and ancient ruins.' }
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
        shortDescription_en: 'Crystal clear water and luxury overwater villas await you.',
        about_en: 'Indulge in paradise with luxury resorts, pristine beaches, and world-class diving. Complete package with flights, accommodation, and water activities.',
        about_bn: 'বিলাসবহুল রিসর্ট, পরিষ্কার সৈকত এবং বিশ্বমানের ডাইভিং। ফ্লাইট, আবাসন এবং জল ক্রিয়াকলাপ সহ সম্পূর্ণ প্যাকেজ।',
        highlights: [
          { icon: '🏝️', title: 'Overwater Villa', desc: 'Stay in a premium villa above the lagoon.' },
          { icon: '🤿', title: 'Snorkeling', desc: 'Explore coral reefs and marine life.' },
          { icon: '🍹', title: 'Resort Dining', desc: 'Enjoy all-inclusive meals and beach bars.' }
        ],
        programme: [
          { day: 1, title: 'Arrival in Malé', desc: 'Speedboat transfer to your resort.' },
          { day: 2, title: 'Island Leisure', desc: 'Relax, snorkel, and enjoy resort amenities.' }
        ],
        includes: ['Return flights', '5-star resort', 'All meals', 'Water activities'],
        excludes: ['Personal expenses', 'Travel insurance', 'Spa treatments'],
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
        shortDescription_en: 'Modern architecture and world-class luxury experiences.',
        about_en: 'Experience the ultimate city break with Burj Khalifa, desert adventures, and luxury shopping. Complete guided tour package.',
        about_bn: 'বুর্জ খলিফা, মরুভূমির অ্যাডভেঞ্চার এবং বিলাসবহুল শপিং। সম্পূর্ণ গাইডেড ট্যুর প্যাকেজ।',
        highlights: [
          { icon: '🏜️', title: 'Desert Safari', desc: 'Dune bashing, camel ride and BBQ dinner.' },
          { icon: '🏙️', title: 'City Tour', desc: 'Burj Khalifa, Dubai Mall and Palm Jumeirah.' },
          { icon: '🛍️', title: 'Shopping', desc: 'Premium retail experiences at famous malls.' }
        ],
        programme: [
          { day: 1, title: 'Arrival & Relax', desc: 'Check in and enjoy the hotel amenities.' },
          { day: 2, title: 'City Tour', desc: 'Visit Burj Khalifa, Dubai Mall and Marina.' }
        ],
        includes: ['Return flights', '4-star hotel', 'Daily breakfast', 'Guided tours'],
        excludes: ['Personal expenses', 'Travel insurance', 'Optional activities'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('travel_packages').insertMany(travelPackages);
    console.log('Inserted travel packages');

    // Insert hajj packages
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
        shortDescription_en: 'Affordable Hajj with comfortable accommodation near Haram.',
        about_en: 'Complete Hajj package with flights, accommodation in Makkah and Madinah, and full guidance throughout the pilgrimage.',
        about_bn: 'ফ্লাইট, মক্কা ও মদিনায় আবাসন এবং হজের সম্পূর্ণ গাইডেন্স সহ সম্পূর্ণ হজ প্যাকেজ।',
        highlights: [
          { icon: '🕋', title: 'Makkah Stay', desc: 'Comfortable hotel near Masjid al-Haram.' },
          { icon: '🕌', title: 'Madinah Stay', desc: 'Hotel close to Masjid an-Nabawi.' },
          { icon: '✈️', title: 'Flight Included', desc: 'Return airfare from Bangladesh.' }
        ],
        programme: [
          { day: 1, title: 'Departure from Bangladesh', desc: 'Flight to Jeddah and transfer to Makkah.' },
          { day: 2, title: 'Umrah', desc: 'Perform Umrah rituals.' },
          { day: 8, title: 'Hajj Rituals', desc: 'Complete Hajj obligations.' }
        ],
        includes: ['Return flights', 'Hotel accommodation', 'Meals', 'Transportation', 'Guide'],
        excludes: ['Personal expenses', 'Travel insurance', 'Optional tours'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'hajj',
        slug: 'premium-hajj',
        title_en: 'Premium Hajj Package',
        title_bn: 'প্রিমিয়াম হজ প্যাকেজ',
        badge: 'VIP',
        price: 3999,
        price_note: 'Luxury package',
        duration: '21 Days',
        rating: 4.9,
        hero_image: 'https://picsum.photos/id/1040/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1040/500/350',
        shortDescription_en: 'Luxury Hajj experience with premium accommodation and services.',
        about_en: 'Premium Hajj package with 5-star hotels, VIP transportation, and personalized guidance for a comfortable pilgrimage.',
        about_bn: '৫-স্টার হোটেল, ভিআইপি ট্রান্সপোর্টেশন এবং ব্যক্তিগত গাইডেন্স সহ প্রিমিয়াম হজ প্যাকেজ।',
        highlights: [
          { icon: '🏨', title: '5-Star Hotels', desc: 'Luxury accommodation near Haram.' },
          { icon: '🚗', title: 'VIP Transport', desc: 'Private vehicles for all transfers.' },
          { icon: '👨‍🏫', title: 'Personal Guide', desc: 'Dedicated guide throughout the journey.' }
        ],
        programme: [
          { day: 1, title: 'VIP Departure', desc: 'Private flight arrangements.' },
          { day: 2, title: 'Luxury Umrah', desc: 'Premium Umrah experience.' }
        ],
        includes: ['Business class flights', '5-star hotels', 'VIP transport', 'Personal guide'],
        excludes: ['Personal expenses', 'Travel insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'hajj',
        slug: 'umrah-package',
        title_en: 'Umrah Package',
        title_bn: 'উমরাহ প্যাকেজ',
        badge: 'Short Trip',
        price: 1499,
        price_note: 'Complete package',
        duration: '10 Days',
        rating: 4.7,
        hero_image: 'https://picsum.photos/id/1057/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1057/500/350',
        shortDescription_en: 'Spiritual journey to perform Umrah with complete guidance.',
        about_en: 'Complete Umrah package including flights, accommodation, and guidance for a meaningful spiritual journey.',
        about_bn: 'ফ্লাইট, আবাসন এবং গাইডেন্স সহ অর্থবহ আধ্যাত্মিক যাত্রার জন্য সম্পূর্ণ উমরাহ প্যাকেজ।',
        highlights: [
          { icon: '🕋', title: 'Haram Visit', desc: 'Easy access to Masjid al-Haram.' },
          { icon: '🕌', title: 'Madinah Visit', desc: 'Visit Masjid an-Nabawi.' },
          { icon: '📿', title: 'Spiritual Guidance', desc: 'Complete Umrah guidance.' }
        ],
        programme: [
          { day: 1, title: 'Arrival in Makkah', desc: 'Transfer and hotel check-in.' },
          { day: 2, title: 'Umrah Rituals', desc: 'Perform Umrah with guidance.' }
        ],
        includes: ['Return flights', 'Hotel accommodation', 'Meals', 'Guide'],
        excludes: ['Personal expenses', 'Travel insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('hajj_packages').insertMany(hajjPackages);
    console.log('Inserted hajj packages');

    // Insert work packages
    const workPackages = [
      {
        type: 'work',
        slug: 'malaysia-factory-work',
        title_en: 'Malaysia Factory Work',
        title_bn: 'মালয়েশিয়া ফ্যাক্টরি কাজ',
        badge: 'High Demand',
        price: 599,
        price_note: 'Processing fee',
        duration: '2 Years',
        rating: 4.6,
        hero_image: 'https://picsum.photos/id/1060/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1060/500/350',
        shortDescription_en: 'Factory work opportunities in Malaysia with good salary.',
        about_en: 'Secure factory work in Malaysia with competitive salary, accommodation, and work permit assistance.',
        about_bn: 'প্রতিযোগিতামূলক বেতন, আবাসন এবং ওয়ার্ক পারমিট সহ মালয়েশিয়ায় ফ্যাক্টরি কাজ।',
        salary: 'RM 1200-1500/month',
        job_type: 'Factory Worker',
        highlights: [
          { icon: '🏭', title: 'Factory Jobs', desc: 'Manufacturing and production work.' },
          { icon: '💰', title: 'Good Salary', desc: 'Competitive wages with overtime.' },
          { icon: '🏠', title: 'Accommodation', desc: 'Company provided housing.' }
        ],
        programme: [
          { day: 1, title: 'Application', desc: 'Submit documents and medical check.' },
          { day: 30, title: 'Visa Processing', desc: 'Complete visa and work permit.' },
          { day: 60, title: 'Departure', desc: 'Fly to Malaysia and start work.' }
        ],
        includes: ['Work visa', 'Flight ticket', 'Medical check', 'Job placement'],
        excludes: ['Personal expenses', 'Insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'work',
        slug: 'singapore-domestic-helper',
        title_en: 'Singapore Domestic Helper',
        title_bn: 'সিঙ্গাপুর ডোমেস্টিক হেলপার',
        badge: 'Trusted',
        price: 799,
        price_note: 'Service fee',
        duration: '2 Years',
        rating: 4.8,
        hero_image: 'https://picsum.photos/id/1070/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1070/500/350',
        shortDescription_en: 'Domestic helper positions in Singapore with excellent conditions.',
        about_en: 'Professional domestic helper positions in Singapore with good working conditions and competitive salary.',
        about_bn: 'ভাল কাজের পরিবেশ এবং প্রতিযোগিতামূলক বেতন সহ সিঙ্গাপুরে পেশাদার ডোমেস্টিক হেলপার পজিশন।',
        salary: 'SGD 600-800/month',
        job_type: 'Domestic Helper',
        highlights: [
          { icon: '🏠', title: 'Home Care', desc: 'Household chores and family care.' },
          { icon: '💼', title: 'Professional', desc: 'Structured work environment.' },
          { icon: '📈', title: 'Career Growth', desc: 'Opportunities for advancement.' }
        ],
        programme: [
          { day: 1, title: 'Training', desc: 'Skills training and preparation.' },
          { day: 15, title: 'Documentation', desc: 'Complete required paperwork.' },
          { day: 45, title: 'Deployment', desc: 'Travel to Singapore.' }
        ],
        includes: ['Work permit', 'Training', 'Flight', 'Placement'],
        excludes: ['Personal expenses'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'work',
        slug: 'dubai-construction',
        title_en: 'Dubai Construction Work',
        title_bn: 'দুবাই কনস্ট্রাকশন কাজ',
        badge: 'Skilled',
        price: 999,
        price_note: 'Processing fee',
        duration: '2 Years',
        rating: 4.5,
        hero_image: 'https://picsum.photos/id/1080/1200/800',
        hero_image_fallback: 'https://picsum.photos/id/1080/500/350',
        shortDescription_en: 'Construction work opportunities in Dubai with high pay.',
        about_en: 'Skilled and semi-skilled construction work in Dubai with excellent salary and modern facilities.',
        about_bn: 'উচ্চ বেতন এবং আধুনিক সুবিধা সহ দুবাইয়ে দক্ষ এবং আধা-দক্ষ নির্মাণ কাজ।',
        salary: 'AED 3000-5000/month',
        job_type: 'Construction Worker',
        highlights: [
          { icon: '🏗️', title: 'Modern Projects', desc: 'Work on world-class construction sites.' },
          { icon: '💰', title: 'High Salary', desc: 'Excellent compensation packages.' },
          { icon: '🏢', title: 'Accommodation', desc: 'Modern labor camps.' }
        ],
        programme: [
          { day: 1, title: 'Skill Assessment', desc: 'Evaluate work experience and skills.' },
          { day: 14, title: 'Medical & Visa', desc: 'Complete health check and visa process.' },
          { day: 30, title: 'Departure', desc: 'Travel to Dubai.' }
        ],
        includes: ['Work visa', 'Flight', 'Accommodation', 'Medical check'],
        excludes: ['Personal expenses', 'Insurance'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('work_packages').insertMany(workPackages);
    console.log('Inserted work packages');

    // Insert content
    const contents = [
      {
        key: 'homepage-hero',
        section: 'hero',
        title_en: 'Explore Beyond The Horizon',
        subtitle_en: '✦ DISCOVER THE WORLD',
        description_en: 'Unforgettable journeys crafted for the curious soul. বিশ্বজুড়ে অসাধারণ অভিজ্ঞতার সন্ধানে।',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homepage-services',
        section: 'services',
        title_en: 'Complete Travel Solutions',
        description_en: 'From visa processing to accommodation, we handle everything for your perfect journey.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'homepage-credentials',
        section: 'credentials',
        title_en: 'Trusted Since 2010',
        description_en: 'Government approved recruiting agency operating legally with full oversight.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('contents').insertMany(contents);
    console.log('Inserted contents');

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
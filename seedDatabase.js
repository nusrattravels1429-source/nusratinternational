require('dotenv').config();
const mongoose = require('mongoose');

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nusrat_international';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Connection Error:', err);
    process.exit(1);
  });

// 2. Define Schemas (Matching the design)

// Travel Package Schema
const travelSchema = new mongoose.Schema({
  title: String,
  slug: String, // unique identifier for URL
  category: { type: String, default: 'travel' },
  shortDescription: String,
  fullDescription: String,
  price: Number,
  duration: String, // e.g., "5 Days"
  location: String,
  images: [String], // Array of image URLs
  highlights: [String],
  itinerary: [{ day: String, description: String }],
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Hajj Package Schema
const hajjSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: { type: String, default: 'hajj' },
  subType: { type: String, enum: ['Hajj', 'Umrah'] },
  shortDescription: String,
  fullDescription: String,
  price: Number,
  duration: String,
  images: [String],
  programme: [{ day: String, activity: String }],
  accommodation: String,
  quranicVerse: { text: String, reference: String },
  scholarGuide: String,
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Work Package Schema
const workSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: { type: String, default: 'work' },
  jobTitle: String,
  shortDescription: String,
  fullDescription: String,
  salary: String,
  sectors: [String],
  contractDuration: String,
  images: [String],
  requirements: [String],
  applicationProcess: [{ step: Number, description: String }],
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Homepage Content Schema
const homeContentSchema = new mongoose.Schema({
  sectionKey: { type: String, unique: true }, // e.g., 'hero_slider', 'certifications'
  content: mongoose.Mixed, // Flexible content based on section
  isActive: { type: Boolean, default: true }
});

// 3. Create Models
const TravelPackage = mongoose.model('TravelPackage', travelSchema, 'travel_packages');
const HajjPackage = mongoose.model('HajjPackage', hajjSchema, 'hajj_packages');
const WorkPackage = mongoose.model('WorkPackage', workSchema, 'work_packages');
const HomeContent = mongoose.model('HomeContent', homeContentSchema, 'homepage_content');

// 4. Seed Data Function
const seedData = async () => {
  try {
    console.log('🧹 Clearing existing data...');
    await TravelPackage.deleteMany({});
    await HajjPackage.deleteMany({});
    await WorkPackage.deleteMany({});
    await HomeContent.deleteMany({});

    console.log('🌱 Inserting sample data...');

    // Sample Travel Data
    await TravelPackage.insertMany([
      {
        title: "Beautiful Switzerland Tour",
        slug: "switzerland-tour-2024",
        shortDescription: "Experience the Alps like never before.",
        fullDescription: "Join us for a breathtaking journey through Switzerland...",
        price: 2500,
        duration: "7 Days",
        location: "Switzerland",
        images: ["https://via.placeholder.com/800x600?text=Switzerland+1", "https://via.placeholder.com/800x600?text=Switzerland+2"],
        highlights: ["Mountain Train Ride", "Lake Cruise", "City Tour"],
        itinerary: [
          { day: "Day 1", description: "Arrival in Zurich" },
          { day: "Day 2", description: "Train to Interlaken" }
        ],
        isFeatured: true
      },
      {
        title: "Paris Romantic Getaway",
        slug: "paris-romantic-getaway",
        shortDescription: "Visit the city of love.",
        fullDescription: "Explore the Eiffel Tower and Louvre Museum...",
        price: 1800,
        duration: "5 Days",
        location: "France",
        images: ["https://via.placeholder.com/800x600?text=Paris+1"],
        highlights: ["Eiffel Tower", "Louvre Museum", "Seine Cruise"],
        isFeatured: false
      }
    ]);

    // Sample Hajj Data
    await HajjPackage.insertMany([
      {
        title: "Premium Hajj Package 2024",
        slug: "premium-hajj-2024",
        subType: "Hajj",
        shortDescription: "All-inclusive Hajj with 5-star hotels.",
        fullDescription: "Complete spiritual journey with guided services...",
        price: 6500,
        duration: "21 Days",
        images: ["https://via.placeholder.com/800x600?text=Hajj+1"],
        programme: [
          { day: "Day 1", activity: "Arrival in Jeddah" },
          { day: "Day 5", activity: "Move to Mina" }
        ],
        accommodation: "5 Star Hotel near Haram",
        quranicVerse: { text: "And complete the Hajj and Umrah for Allah...", reference: "Surah Al-Baqarah 2:196" },
        scholarGuide: "Sheikh Abdullah",
        isFeatured: true
      },
      {
        title: "Economy Umrah Package",
        slug: "economy-umrah-ramadan",
        subType: "Umrah",
        shortDescription: "Affordable Umrah for Ramadan.",
        fullDescription: "Budget-friendly package without compromising comfort...",
        price: 1200,
        duration: "10 Days",
        images: ["https://via.placeholder.com/800x600?text=Umrah+1"],
        programme: [],
        accommodation: "3 Star Hotel (Shuttle service)",
        isFeatured: false
      }
    ]);

    // Sample Work Data
    await WorkPackage.insertMany([
      {
        title: "Construction Worker - Saudi Arabia",
        slug: "construction-worker-saudi",
        jobTitle: "Civil Construction Worker",
        shortDescription: "Urgent hiring for major infrastructure projects.",
        fullDescription: "We are hiring experienced construction workers...",
        salary: "$800 - $1200 / month",
        sectors: ["Construction", "Infrastructure"],
        contractDuration: "2 Years",
        images: ["https://via.placeholder.com/800x600?text=Construction+Job"],
        requirements: ["Valid Passport", "2 Years Experience", "Medical Fit"],
        applicationProcess: [
          { step: 1, description: "Submit Application" },
          { step: 2, description: "Interview" },
          { step: 3, description: "Visa Processing" }
        ],
        isFeatured: true
      },
      {
        title: "Driver Needed - UAE",
        slug: "driver-uae-heavy",
        jobTitle: "Heavy Vehicle Driver",
        shortDescription: "Licensed drivers required for logistics company.",
        fullDescription: "Must have valid heavy vehicle license...",
        salary: "$1000 / month",
        sectors: ["Logistics", "Transport"],
        contractDuration: "1 Year",
        images: ["https://via.placeholder.com/800x600?text=Driver+Job"],
        requirements: ["UAE License or Convertable", "Good Driving Record"],
        applicationProcess: [],
        isFeatured: false
      }
    ]);

    // Sample Homepage Content
    await HomeContent.insertMany([
      {
        sectionKey: "hero_slider",
        content: [
          { title: "Welcome to Nusrat International", subtitle: "Your Trusted Partner for Travel & Work", image: "https://via.placeholder.com/1920x600?text=Hero+Slide+1" },
          { title: "Hajj & Umrah Services", subtitle: "Spiritual journeys made easy", image: "https://via.placeholder.com/1920x600?text=Hero+Slide+2" }
        ]
      },
      {
        sectionKey: "certifications",
        content: [
          { name: "ISO 9001 Certified", logo: "https://via.placeholder.com/100x100?text=ISO" },
          { name: "Govt Approved", logo: "https://via.placeholder.com/100x100?text=Govt" }
        ]
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('   - Travel Packages:', await TravelPackage.countDocuments());
    console.log('   - Hajj Packages:', await HajjPackage.countDocuments());
    console.log('   - Work Packages:', await WorkPackage.countDocuments());
    console.log('   - Home Content Sections:', await HomeContent.countDocuments());
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
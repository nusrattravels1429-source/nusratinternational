const mongoose = require('mongoose');

const hajjPackageSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'hajj' },
  packageType: { 
    type: String, 
    enum: ['hajj', 'umrah'], 
    required: true 
  },
  subType: {
    type: String,
    enum: ['economy', 'standard', 'premium', 'vip'],
    default: 'standard'
  },
  shortDescription: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  fullDescription: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  price: {
    amount: Number,
    currency: { type: String, default: 'BDT' }
  },
  duration: {
    days: Number,
    nights: Number
  },
  programme: [{
    day: Number,
    title: {
      en: String,
      bn: String
    },
    description: {
      en: String,
      bn: String
    },
    location: {
      en: String,
      bn: String
    }
  }],
  accommodation: {
    makkah: {
      hotelName: { en: String, bn: String },
      distanceFromHaram: String,
      roomType: { en: String, bn: String },
      stars: Number
    },
    madinah: {
      hotelName: { en: String, bn: String },
      distanceFromHaram: String,
      roomType: { en: String, bn: String },
      stars: Number
    }
  },
  quranicVerse: {
    arabic: String,
    translation: {
      en: String,
      bn: String
    },
    reference: String
  },
  hadith: {
    text: {
      en: String,
      bn: String
    },
    reference: String
  },
  scholarGuide: {
    name: {
      en: String,
      bn: String
    },
    bio: {
      en: String,
      bn: String
    },
    image: String
  },
  highlights: [{
    en: String,
    bn: String
  }],
  included: [{
    en: String,
    bn: String
  }],
  excluded: [{
    en: String,
    bn: String
  }],
  gallery: [{
    url: String,
    alt: String
  }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  availableSeats: Number,
  startDate: Date,
  endDate: Date,
  metaTitle: {
    en: String,
    bn: String
  },
  metaDescription: {
    en: String,
    bn: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HajjPackage', hajjPackageSchema);

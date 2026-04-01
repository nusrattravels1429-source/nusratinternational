const mongoose = require('mongoose');

const travelPackageSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'travel' },
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
  highlights: [{
    en: String,
    bn: String
  }],
  itinerary: [{
    day: Number,
    title: {
      en: String,
      bn: String
    },
    description: {
      en: String,
      bn: String
    }
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

module.exports = mongoose.model('TravelPackage', travelPackageSchema);

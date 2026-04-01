const mongoose = require('mongoose');

const homepageContentSchema = new mongoose.Schema({
  heroSlider: [{
    title: {
      en: String,
      bn: String
    },
    subtitle: {
      en: String,
      bn: String
    },
    description: {
      en: String,
      bn: String
    },
    backgroundImage: String,
    ctaText: {
      en: String,
      bn: String
    },
    ctaLink: String,
    isActive: { type: Boolean, default: true },
    order: Number
  }],
  featuredPackages: {
    travel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TravelPackage' }],
    hajj: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HajjPackage' }],
    work: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkPackage' }]
  },
  certifications: [{
    title: {
      en: String,
      bn: String
    },
    description: {
      en: String,
      bn: String
    },
    image: String,
    issuer: {
      en: String,
      bn: String
    },
    year: Number,
    order: Number
  }],
  ticketingCountries: [{
    name: {
      en: String,
      bn: String
    },
    code: String,
    flag: String,
    order: Number
  }],
  aboutSection: {
    title: {
      en: String,
      bn: String
    },
    description: {
      en: String,
      bn: String
    },
    image: String,
    highlights: [{
      en: String,
      bn: String
    }]
  },
  stats: [{
    label: {
      en: String,
      bn: String
    },
    value: String,
    icon: String
  }],
  testimonials: [{
    name: String,
    designation: {
      en: String,
      bn: String
    },
    comment: {
      en: String,
      bn: String
    },
    rating: { type: Number, min: 0, max: 5 },
    image: String,
    isActive: { type: Boolean, default: true }
  }],
  newsAndUpdates: [{
    title: {
      en: String,
      bn: String
    },
    description: {
      en: String,
      bn: String
    },
    date: Date,
    image: String,
    link: String,
    isActive: { type: Boolean, default: true }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('HomepageContent', homepageContentSchema);

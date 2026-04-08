const mongoose = require('mongoose');

const workPackageSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'work' },
  jobTitle: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  company: {
    name: {
      en: String,
      bn: String
    },
    logo: String,
    location: {
      country: String,
      city: String
    }
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
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'SAR' },
    period: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' }
  },
  sectors: [{
    en: String,
    bn: String
  }],
  experienceRequired: {
    years: Number,
    description: {
      en: String,
      bn: String
    }
  },
  educationRequired: {
    level: { type: String, enum: ['secondary', 'higher_secondary', 'bachelor', 'master', 'phd'] },
    field: {
      en: String,
      bn: String
    }
  },
  skillsRequired: [{
    en: String,
    bn: String
  }],
  contractDuration: {
    years: Number,
    months: Number,
    renewable: Boolean
  },
  workingHours: {
    perDay: Number,
    perWeek: Number,
    description: {
      en: String,
      bn: String
    }
  },
  benefits: [{
    en: String,
    bn: String
  }],
  applicationProcess: [{
    step: Number,
    title: {
      en: String,
      bn: String
    },
    description: {
      en: String,
      bn: String
    }
  }],
  requirements: [{
    en: String,
    bn: String
  }],
  documentsRequired: [{
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
  availablePositions: Number,
  applicationDeadline: Date,
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

module.exports = mongoose.model('WorkPackage', workPackageSchema);

const mongoose = require('mongoose');
const slugify = require('slugify');

const cardSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['travel', 'hajj', 'work']
  },
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    en: String,
    bn: String
  },
  images: [{
    url: String,
    caption: String,
    order: Number
  }],
  location: {
    en: String,
    bn: String
  },
  pricing: {
    amount: String,
    currency: { type: String, default: 'BDT' },
    displayText: {
      en: String,
      bn: String
    }
  },
  duration: String,
  features: [{
    en: String,
    bn: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: mongoose.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate slug before saving
cardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.slug && this.title?.en) {
    this.slug = slugify(this.title.en, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Card', cardSchema);

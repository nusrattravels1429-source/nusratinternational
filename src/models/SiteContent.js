const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  section: {
    type: String,
    required: true,
    enum: ['homepage', 'ticketing', 'travel', 'hajj', 'work', 'contact', 'about', 'gallery', 'certifications', 'team', 'navigation', 'footer']
  },
  title: {
    en: String,
    bn: String
  },
  content: {
    en: String,
    bn: String
  },
  images: [{
    url: String,
    caption: {
      en: String,
      bn: String
    },
    order: Number
  }],
  metadata: mongoose.Mixed,
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

siteContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SiteContent', siteContentSchema);

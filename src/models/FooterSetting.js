const mongoose = require('mongoose');

const footerSettingSchema = new mongoose.Schema({
  companyName: {
    en: String,
    bn: String
  },
  tagline: {
    en: String,
    bn: String
  },
  contactInfo: {
    address: {
      en: String,
      bn: String
    },
    phone: String,
    email: String
  },
  socialLinks: {
    facebook: String,
    youtube: String,
    instagram: String,
    whatsapp: String,
    linkedin: String,
    twitter: String
  },
  mapEmbedUrl: String,
  quickLinks: [{
    label: {
      en: String,
      bn: String
    },
    url: String
  }],
  copyrightText: {
    en: String,
    bn: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

footerSettingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FooterSetting', footerSettingSchema);

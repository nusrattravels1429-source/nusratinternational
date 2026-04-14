const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: String
  },
  description: {
    en: String,
    bn: String
  },
  issuingOrganization: {
    en: String,
    bn: String
  },
  logo: {
    url: String,
    alt: String
  },
  certificateImage: {
    url: String,
    alt: String
  },
  issueDate: Date,
  expiryDate: Date,
  certificateNumber: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certification', certificationSchema);

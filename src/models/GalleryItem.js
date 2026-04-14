const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['team', 'achievement', 'event', 'other']
  },
  title: {
    en: { type: String, required: true },
    bn: String
  },
  description: {
    en: String,
    bn: String
  },
  images: [{
    url: { type: String, required: true },
    caption: {
      en: String,
      bn: String
    },
    order: Number
  }],
  eventDate: Date,
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

module.exports = mongoose.model('GalleryItem', galleryItemSchema);

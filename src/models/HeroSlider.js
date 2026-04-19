const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const heroContentSchema = new mongoose.Schema({
  subtitle_en: {
    type: String,
    default: '✦ DISCOVER THE WORLD'
  },
  subtitle_bn: {
    type: String,
    default: '✦ বিশ্ব জুড়ে অন্বেষণ'
  },
  title_en: {
    type: String,
    default: 'Explore Beyond<br/><em>The Horizon</em>'
  },
  title_bn: {
    type: String,
    default: 'দিগন্তের ওপারে<br/><em>অন্বেষণ করুন</em>'
  },
  description_en: {
    type: String,
    default: 'Unforgettable journeys crafted for the curious soul.<br />বিশ্বজুড়ে অসাধারণ অভিজ্ঞতার সন্ধানে।'
  },
  description_bn: {
    type: String,
    default: 'উৎসুক আত্মার জন্য তৈরি অবিস্মরণীয় যাত্রা।<br />বিশ্বজুড়ে অসাধারণ অভিজ্ঞতার সন্ধানে।'
  },
  ctaText_en: {
    type: String,
    default: 'Start Exploring'
  },
  ctaText_bn: {
    type: String,
    default: 'অন্বেষণ শুরু করুন'
  },
  ctaLink: {
    type: String,
    default: '#travel'
  }
});

const heroSettingsSchema = new mongoose.Schema({
  autoPlay: {
    type: Boolean,
    default: true
  },
  transitionSpeed: {
    type: Number,
    default: 5000
  },
  showDots: {
    type: Boolean,
    default: true
  },
  showArrows: {
    type: Boolean,
    default: true
  }
});

const heroSliderSchema = new mongoose.Schema({
  slides: {
    type: [heroSlideSchema],
    default: []
  },
  content: {
    type: heroContentSchema,
    default: () => ({})
  },
  settings: {
    type: heroSettingsSchema,
    default: () => ({})
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one document exists in the collection
heroSliderSchema.index({ _id: 1 });

module.exports = mongoose.model('HeroSlider', heroSliderSchema);

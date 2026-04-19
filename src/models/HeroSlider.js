--- src/models/HeroSlider.js (原始)
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

+++ src/models/HeroSlider.js (修改后)
const { ObjectId } = require('mongodb');

// Collection name constant
const COLLECTION_NAME = 'heroSliders';

// Default content fallbacks
const DEFAULT_CONTENT = {
  subtitle_en: '✦ DISCOVER THE WORLD',
  subtitle_bn: '✦ বিশ্ব জুড়ে অন্বেষণ',
  title_en: 'Explore Beyond<br/><em>The Horizon</em>',
  title_bn: 'দিগন্তের ওপারে<br/><em>অন্বেষণ করুন</em>',
  description_en: 'Unforgettable journeys crafted for the curious soul.<br />বিশ্বজুড়ে অসাধারণ অভিজ্ঞতার সন্ধানে।',
  description_bn: 'উৎসুক আত্মার জন্য তৈরি অবিস্মরণীয় যাত্রা。<br />বিশ্বজুড়ে অসাধারণ অভিজ্ঞতার সন্ধানে।',
  ctaText_en: 'Start Exploring',
  ctaText_bn: 'অন্বেষণ শুরু করুন',
  ctaLink: '#travel'
};

const DEFAULT_SETTINGS = {
  autoPlay: true,
  transitionSpeed: 5000,
  showDots: true,
  showArrows: true
};

/**
 * Get hero slider document from native MongoDB
 */
async function getHeroSlider(db) {
  const collection = db.collection(COLLECTION_NAME);
  return await collection.findOne();
}

/**
 * Get or create the single hero slider document
 */
async function getOrCreateHeroSlider(db) {
  let slider = await getHeroSlider(db);

  if (!slider) {
    // Create default slider with 4 empty slots
    const defaultSlider = {
      slides: [
        { imageUrl: '', order: 0, isActive: true },
        { imageUrl: '', order: 1, isActive: true },
        { imageUrl: '', order: 2, isActive: true },
        { imageUrl: '', order: 3, isActive: true }
      ],
      content: DEFAULT_CONTENT,
      settings: DEFAULT_SETTINGS,
      updatedAt: new Date(),
      createdAt: new Date()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(defaultSlider);
    slider = { _id: result.insertedId, ...defaultSlider };
  }

  return slider;
}

/**
 * Save hero slider document
 */
async function saveHeroSlider(db, slider) {
  const collection = db.collection(COLLECTION_NAME);
  slider.updatedAt = new Date();

  if (slider._id) {
    await collection.updateOne(
      { _id: slider._id },
      { $set: slider }
    );
  } else {
    const result = await collection.insertOne(slider);
    slider._id = result.insertedId;
  }

  return slider;
}

module.exports = {
  getHeroSlider,
  getOrCreateHeroSlider,
  saveHeroSlider
};

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    bn: { type: String, required: true }
  },
  category: {
    type: String,
    enum: ['travel', 'hajj', 'umrah', 'work'],
    required: true,
    index: true
  },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  images: [String],
  features: [String],
  included: [String],
  slug: { type: String, unique: true, required: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  details: {
    itinerary: [String],
    accommodation: String,
    transportation: String,
    guide: String,
    requirements: [String],
    programme: [String],
    salary: String,
    sectors: [String],
    contractDuration: String,
    applicationProcess: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', packageSchema);

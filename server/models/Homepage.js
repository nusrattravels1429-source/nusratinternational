const mongoose = require('mongoose');

const homepageSchema = new mongoose.Schema({
  heroSlides: [{
    title: {
      en: String,
      bn: String
    },
    subtitle: {
      en: String,
      bn: String
    },
    image: String,
    link: String
  }],
  certifications: [{
    name: {
      en: String,
      bn: String
    },
    number: String,
    logo: String
  }],
  countries: [{
    name: {
      en: String,
      bn: String
    },
    flag: String,
    code: String
  }],
  about: {
    title: {
      en: String,
      bn: String
    },
    content: {
      en: String,
      bn: String
    },
    image: String
  },
  stats: [{
    value: String,
    label: {
      en: String,
      bn: String
    },
    icon: String
  }],
  featuredPackages: {
    travel: [String], // Package IDs
    hajj: [String],
    work: [String]
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String,
    officeHours: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String
  }
});

module.exports = mongoose.model('Homepage', homepageSchema);

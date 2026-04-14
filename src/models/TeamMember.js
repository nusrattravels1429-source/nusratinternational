const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    bn: String
  },
  designation: {
    en: { type: String, required: true },
    bn: String
  },
  bio: {
    en: String,
    bn: String
  },
  photo: {
    url: String,
    alt: String
  },
  email: String,
  phone: String,
  socialLinks: {
    facebook: String,
    linkedin: String,
    twitter: String
  },
  isFounder: {
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
  joinedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);

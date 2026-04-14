const mongoose = require('mongoose');

const navLinkSchema = new mongoose.Schema({
  label: {
    en: { type: String, required: true },
    bn: String
  },
  url: {
    type: String,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NavLink',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOpenInNewTab: {
    type: Boolean,
    default: false
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NavLink'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

navLinkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('NavLink', navLinkSchema);

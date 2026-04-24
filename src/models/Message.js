const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    default: 'General Inquiry'
  },
  message: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['Contact Page', 'Travel Page', 'Hajj Page', 'Work Page', 'Other'],
    default: 'Contact Page'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    packageId: mongoose.Schema.Types.ObjectId,
    packageName: String,
    url: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better performance
messageSchema.index({ createdAt: -1 });
messageSchema.index({ isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);

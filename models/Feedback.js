const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedbackId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['service', 'staff', 'facility', 'pricing', 'overall'],
    default: 'overall'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  response: {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: Date
  },
  helpful: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for efficient queries
feedbackSchema.index({ rating: 1, createdAt: -1 });
feedbackSchema.index({ customer: 1 });
feedbackSchema.index({ category: 1, isPublic: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
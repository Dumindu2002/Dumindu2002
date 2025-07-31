const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Feedback = require('../models/Feedback');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/feedbacks
// @desc    Get all feedbacks with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      rating,
      category,
      isPublic
    } = req.query;

    const filter = {};
    if (rating) filter.rating = parseInt(rating);
    if (category) filter.category = category;
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

    const feedbacks = await Feedback.find(filter)
      .populate('customer', 'name email phone')
      .populate('booking', 'service date')
      .populate('response.author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Feedback.countDocuments(filter);

    res.json({
      feedbacks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ message: 'Server error fetching feedbacks' });
  }
});

// @route   GET /api/feedbacks/:id
// @desc    Get feedback by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('booking', 'service date startTime endTime')
      .populate('response.author', 'name email');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error fetching feedback' });
  }
});

// @route   POST /api/feedbacks
// @desc    Create new feedback
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      customer,
      booking,
      rating,
      title,
      comment,
      category,
      isPublic,
      tags
    } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({
      feedbackId: `FB-${uuidv4().substring(0, 8).toUpperCase()}`,
      customer,
      booking,
      rating,
      title,
      comment,
      category: category || 'overall',
      isPublic: isPublic !== undefined ? isPublic : true,
      tags: tags || []
    });

    await feedback.save();
    await feedback.populate('customer', 'name email phone');
    await feedback.populate('booking', 'service date');

    res.status(201).json({
      message: 'Feedback created successfully',
      feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Server error creating feedback' });
  }
});

// @route   POST /api/feedbacks/:id/response
// @desc    Respond to feedback
// @access  Private
router.post('/:id/response', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Response content is required' });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.response = {
      author: req.user._id,
      content,
      timestamp: new Date()
    };

    await feedback.save();
    await feedback.populate('response.author', 'name email');

    res.json({
      message: 'Response added successfully',
      response: feedback.response
    });
  } catch (error) {
    console.error('Add feedback response error:', error);
    res.status(500).json({ message: 'Server error adding response' });
  }
});

// @route   PUT /api/feedbacks/:id/helpful
// @desc    Mark feedback as helpful
// @access  Private
router.put('/:id/helpful', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.helpful += 1;
    await feedback.save();

    res.json({
      message: 'Feedback marked as helpful',
      helpful: feedback.helpful
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error marking feedback as helpful' });
  }
});

// @route   GET /api/feedbacks/stats/summary
// @desc    Get feedback statistics summary
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    // Average rating
    const averageRating = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalFeedbacks: { $sum: 1 }
        }
      }
    ]);

    // Rating distribution
    const ratingDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Category breakdown
    const categoryBreakdown = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Recent feedbacks count
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentFeedbacks = await Feedback.countDocuments({
      createdAt: { $gte: last30Days }
    });

    res.json({
      average: averageRating[0] || { avgRating: 0, totalFeedbacks: 0 },
      distribution: ratingDistribution,
      categories: categoryBreakdown,
      recentCount: recentFeedbacks
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ message: 'Server error fetching feedback statistics' });
  }
});

module.exports = router;
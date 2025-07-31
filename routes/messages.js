const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages
// @desc    Get all messages with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      priority
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const messages = await Message.find(filter)
      .populate('sender', 'name email phone')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Message.countDocuments(filter);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// @route   GET /api/messages/:id
// @desc    Get message by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email phone')
      .populate('recipient', 'name email')
      .populate('replies.author', 'name email');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Mark as read if it was unread
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.json(message);
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ message: 'Server error fetching message' });
  }
});

// @route   POST /api/messages/:id/reply
// @desc    Reply to a message
// @access  Private
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.replies.push({
      author: req.user._id,
      content,
      timestamp: new Date()
    });

    message.status = 'replied';
    await message.save();

    await message.populate('replies.author', 'name email');

    res.json({
      message: 'Reply sent successfully',
      reply: message.replies[message.replies.length - 1]
    });
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({ message: 'Server error sending reply' });
  }
});

// @route   PUT /api/messages/:id/status
// @desc    Update message status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['unread', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('sender', 'name email');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      message: 'Message status updated successfully',
      updatedMessage: message
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ message: 'Server error updating message status' });
  }
});

module.exports = router;
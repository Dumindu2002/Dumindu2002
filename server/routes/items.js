const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items - Get all items with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    const items = await Item.find(filter)
      .populate('createdBy', 'username email firstName lastName')
      .populate('updatedBy', 'username email firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Item.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// GET /api/items/:id - Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('createdBy', 'username email firstName lastName')
      .populate('updatedBy', 'username email firstName lastName');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

// POST /api/items - Create new item
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      value,
      percentage,
      status,
      priority,
      tags,
      createdBy
    } = req.body;
    
    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        message: 'Title, description, and category are required'
      });
    }
    
    const item = new Item({
      title,
      description,
      category,
      value: value || 0,
      percentage: percentage || 0,
      status: status || 'active',
      priority: priority || 'medium',
      tags: tags || [],
      createdBy: createdBy || null
    });
    
    const savedItem = await item.save();
    const populatedItem = await Item.findById(savedItem._id)
      .populate('createdBy', 'username email firstName lastName');
    
    res.status(201).json({
      message: 'Item created successfully',
      item: populatedItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
});

// PUT /api/items/:id - Update item
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      value,
      percentage,
      status,
      priority,
      tags,
      updatedBy
    } = req.body;
    
    const updateData = {
      title,
      description,
      category,
      value,
      percentage,
      status,
      priority,
      tags,
      updatedBy
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email firstName lastName')
     .populate('updatedBy', 'username email firstName lastName');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// PATCH /api/items/:id - Partial update item
router.patch('/:id', async (req, res) => {
  try {
    const allowedUpdates = ['title', 'description', 'category', 'value', 'percentage', 'status', 'priority', 'tags', 'updatedBy'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    updates.forEach(update => {
      item[update] = req.body[update];
    });
    
    await item.save();
    
    const updatedItem = await Item.findById(item._id)
      .populate('createdBy', 'username email firstName lastName')
      .populate('updatedBy', 'username email firstName lastName');
    
    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// DELETE /api/items/:id - Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({
      message: 'Item deleted successfully',
      item
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

// DELETE /api/items - Bulk delete items
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of item IDs' });
    }
    
    const result = await Item.deleteMany({ _id: { $in: ids } });
    
    res.json({
      message: `${result.deletedCount} items deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting items', error: error.message });
  }
});

// GET /api/items/stats/summary - Get items statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalValue: { $sum: '$value' },
          averageValue: { $avg: '$value' },
          averagePercentage: { $avg: '$percentage' }
        }
      }
    ]);
    
    const statusStats = await Item.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const categoryStats = await Item.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$value' } } }
    ]);
    
    const priorityStats = await Item.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    res.json({
      summary: stats[0] || { totalItems: 0, totalValue: 0, averageValue: 0, averagePercentage: 0 },
      statusBreakdown: statusStats,
      categoryBreakdown: categoryStats,
      priorityBreakdown: priorityStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;
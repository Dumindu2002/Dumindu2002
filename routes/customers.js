const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const { auth, managerAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isActive
    } = req.query;

    // Build filter object
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Customer.countDocuments(filter);

    res.json({
      customers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error fetching customers' });
  }
});

// @route   GET /api/customers/:id
// @desc    Get customer by ID with booking history
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get customer's booking history
    const bookings = await Booking.find({ customer: req.params.id })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    res.json({
      customer,
      bookings
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error fetching customer' });
  }
});

// @route   POST /api/customers
// @desc    Create new customer
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dateOfBirth,
      preferences,
      notes
    } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingCustomer) {
      return res.status(400).json({ 
        message: 'Customer with this email or phone already exists' 
      });
    }

    const customer = new Customer({
      customerId: `CU-${uuidv4().substring(0, 8).toUpperCase()}`,
      name,
      email,
      phone,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      preferences: preferences || [],
      notes
    });

    await customer.save();

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error creating customer' });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dateOfBirth,
      preferences,
      notes,
      isActive
    } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if email or phone is already taken by another customer
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (phone && phone !== customer.phone) {
      const existingCustomer = await Customer.findOne({ 
        phone, 
        _id: { $ne: req.params.id } 
      });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Phone already in use' });
      }
    }

    // Update fields
    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    if (dateOfBirth) customer.dateOfBirth = new Date(dateOfBirth);
    if (preferences) customer.preferences = preferences;
    if (notes !== undefined) customer.notes = notes;
    if (isActive !== undefined) customer.isActive = isActive;

    await customer.save();

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error updating customer' });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Manager
router.delete('/:id', managerAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if customer has active bookings
    const activeBookings = await Booking.countDocuments({
      customer: req.params.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete customer with active bookings' 
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error deleting customer' });
  }
});

// @route   GET /api/customers/:id/stats
// @desc    Get customer statistics
// @access  Private
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const customerId = req.params.id;

    // Total bookings
    const totalBookings = await Booking.countDocuments({ customer: customerId });

    // Total spent
    const totalSpent = await Booking.aggregate([
      { $match: { customer: customerId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    // Last visit
    const lastVisit = await Booking.findOne({ 
      customer: customerId, 
      status: 'completed' 
    })
    .sort({ date: -1 })
    .select('date');

    // Upcoming bookings
    const upcomingBookings = await Booking.countDocuments({
      customer: customerId,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Update customer stats
    await Customer.findByIdAndUpdate(customerId, {
      totalBookings,
      totalSpent: totalSpent[0]?.total || 0,
      lastVisit: lastVisit?.date
    });

    res.json({
      totalBookings,
      totalSpent: totalSpent[0]?.total || 0,
      lastVisit: lastVisit?.date,
      upcomingBookings
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ message: 'Server error fetching customer stats' });
  }
});

module.exports = router;
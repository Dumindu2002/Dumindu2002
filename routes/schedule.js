const express = require('express');
const moment = require('moment');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/schedule
// @desc    Get schedule data for calendar view
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      view = 'month',
      assignedTo 
    } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to current month
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
    }

    const filter = {
      date: { $gte: start, $lte: end }
    };

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email phone')
      .populate('assignedTo', 'name email')
      .sort({ date: 1, startTime: 1 })
      .lean();

    // Group by date for calendar view
    const schedule = {};
    bookings.forEach(booking => {
      const dateKey = moment(booking.date).format('YYYY-MM-DD');
      if (!schedule[dateKey]) {
        schedule[dateKey] = [];
      }
      schedule[dateKey].push({
        id: booking._id,
        title: `${booking.service} - ${booking.customer.name}`,
        start: `${dateKey}T${booking.startTime}`,
        end: `${dateKey}T${booking.endTime}`,
        customer: booking.customer,
        service: booking.service,
        status: booking.status,
        assignedTo: booking.assignedTo
      });
    });

    res.json({ schedule, bookings });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error fetching schedule' });
  }
});

// @route   GET /api/schedule/availability
// @desc    Check availability for a specific date and time
// @access  Private
router.get('/availability', auth, async (req, res) => {
  try {
    const { date, startTime, endTime, assignedTo } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Date, start time, and end time are required' 
      });
    }

    const filter = {
      date: new Date(date),
      status: { $nin: ['cancelled'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    };

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const conflictingBookings = await Booking.find(filter);

    res.json({
      available: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.length,
      conflicts: conflictingBookings
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Server error checking availability' });
  }
});

module.exports = router;
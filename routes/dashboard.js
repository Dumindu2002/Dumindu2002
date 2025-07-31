const express = require('express');
const moment = require('moment');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const Message = require('../models/Message');
const Feedback = require('../models/Feedback');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview with key metrics
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonth = moment().subtract(1, 'month').toDate();
    const lastWeek = moment().subtract(1, 'week').toDate();

    // Get current period stats
    const currentBookings = await Booking.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    const currentRevenue = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    const currentCustomers = await Customer.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    // Get previous period stats for comparison
    const previousMonth = moment().subtract(2, 'months').toDate();
    
    const previousBookings = await Booking.countDocuments({
      createdAt: { $gte: previousMonth, $lt: lastMonth }
    });

    const previousRevenue = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: previousMonth, $lt: lastMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    const previousCustomers = await Customer.countDocuments({
      createdAt: { $gte: previousMonth, $lt: lastMonth }
    });

    // Calculate percentage changes
    const salesChange = previousBookings > 0 
      ? Math.round(((currentBookings - previousBookings) / previousBookings) * 100)
      : 0;

    const revenueChange = previousRevenue.length > 0 && previousRevenue[0].total > 0
      ? Math.round(((currentRevenue[0]?.total || 0) - previousRevenue[0].total) / previousRevenue[0].total * 100)
      : 0;

    const customerChange = previousCustomers > 0
      ? Math.round(((currentCustomers - previousCustomers) / previousCustomers) * 100)
      : 0;

    // Get unread messages count
    const unreadMessages = await Message.countDocuments({ status: 'unread' });

    // Get today's bookings
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    const todayBookings = await Booking.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd }
    });

    // Get pending invoices
    const pendingInvoices = await Invoice.countDocuments({
      status: { $in: ['sent', 'overdue'] }
    });

    res.json({
      metrics: {
        sales: {
          current: currentBookings,
          change: salesChange,
          label: 'Sales'
        },
        revenue: {
          current: currentRevenue[0]?.total || 0,
          change: revenueChange,
          label: 'Revenue'
        },
        customers: {
          current: currentCustomers,
          change: customerChange,
          label: 'New Customers'
        }
      },
      stats: {
        unreadMessages,
        todayBookings,
        pendingInvoices,
        totalCustomers: await Customer.countDocuments({ isActive: true })
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard overview' });
  }
});

// @route   GET /api/dashboard/chart-data
// @desc    Get chart data for dashboard
// @access  Private
router.get('/chart-data', auth, async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let startDate, groupBy, dateFormat;
    
    switch (period) {
      case '7days':
        startDate = moment().subtract(7, 'days').toDate();
        groupBy = { $dayOfYear: '$createdAt' };
        dateFormat = 'MMM DD';
        break;
      case '30days':
        startDate = moment().subtract(30, 'days').toDate();
        groupBy = { $dayOfYear: '$createdAt' };
        dateFormat = 'MMM DD';
        break;
      case '12months':
        startDate = moment().subtract(12, 'months').toDate();
        groupBy = { $month: '$createdAt' };
        dateFormat = 'MMM YYYY';
        break;
      default:
        startDate = moment().subtract(7, 'days').toDate();
        groupBy = { $dayOfYear: '$createdAt' };
        dateFormat = 'MMM DD';
    }

    // Get bookings data
    const bookingsData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          revenue: { $sum: '$price' },
          date: { $first: '$createdAt' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Format data for frontend
    const chartData = bookingsData.map(item => ({
      date: moment(item.date).format(dateFormat),
      bookings: item.count,
      revenue: item.revenue
    }));

    res.json({ chartData });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ message: 'Server error fetching chart data' });
  }
});

// @route   GET /api/dashboard/recent-activities
// @desc    Get recent activities for dashboard
// @access  Private
router.get('/recent-activities', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get recent messages
    const recentMessages = await Message.find({ status: 'unread' })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get recent feedback
    const recentFeedback = await Feedback.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      recentBookings: recentBookings.map(booking => ({
        id: booking._id,
        type: 'booking',
        title: `New booking: ${booking.service}`,
        customer: booking.customer.name,
        time: booking.createdAt,
        status: booking.status
      })),
      recentMessages: recentMessages.map(message => ({
        id: message._id,
        type: 'message',
        title: message.subject,
        customer: message.sender.name,
        time: message.createdAt,
        priority: message.priority
      })),
      recentFeedback: recentFeedback.map(feedback => ({
        id: feedback._id,
        type: 'feedback',
        title: feedback.title,
        customer: feedback.customer.name,
        rating: feedback.rating,
        time: feedback.createdAt
      }))
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({ message: 'Server error fetching recent activities' });
  }
});

// @route   GET /api/dashboard/calendar-data
// @desc    Get calendar data for dashboard
// @access  Private
router.get('/calendar-data', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : moment().month() + 1;
    const currentYear = year ? parseInt(year) : moment().year();

    const startDate = moment([currentYear, currentMonth - 1, 1]).startOf('month').toDate();
    const endDate = moment([currentYear, currentMonth - 1, 1]).endOf('month').toDate();

    // Get bookings for the month
    const bookings = await Booking.find({
      date: { $gte: startDate, $lte: endDate }
    })
    .populate('customer', 'name email')
    .sort({ date: 1, startTime: 1 })
    .lean();

    // Group bookings by date
    const calendarData = {};
    bookings.forEach(booking => {
      const dateKey = moment(booking.date).format('YYYY-MM-DD');
      if (!calendarData[dateKey]) {
        calendarData[dateKey] = [];
      }
      calendarData[dateKey].push({
        id: booking._id,
        service: booking.service,
        customer: booking.customer.name,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status
      });
    });

    res.json({ calendarData });
  } catch (error) {
    console.error('Calendar data error:', error);
    res.status(500).json({ message: 'Server error fetching calendar data' });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data for dashboard
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    // Customer satisfaction from feedback
    const satisfactionData = await Feedback.aggregate([
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

    // Popular services
    const popularServices = await Booking.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Booking status distribution
    const bookingStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly revenue trend
    const revenueData = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: moment().subtract(12, 'months').toDate() }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      satisfaction: satisfactionData,
      popularServices,
      bookingStatus,
      revenueData: revenueData.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        revenue: item.revenue,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

module.exports = router;
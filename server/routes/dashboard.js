const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get basic counts
    const totalItems = await Item.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeItems = await Item.countDocuments({ status: 'active' });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Calculate percentage changes (simulated for demo)
    const salesGrowth = 95; // +95%
    const userGrowth = 70;  // +70%
    const pageVisitGrowth = 10; // +10%

    // Get category breakdown with values
    const categoryStats = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          averageValue: { $avg: '$value' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentItems = await Item.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).countDocuments();

    const recentUsers = await User.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).countDocuments();

    // Generate chart data for the last 7 days
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate some data points
      const dayItems = Math.floor(Math.random() * 50) + 10;
      const dayUsers = Math.floor(Math.random() * 20) + 5;
      const dayRevenue = Math.floor(Math.random() * 1000) + 500;

      chartData.push({
        date: date.toISOString().split('T')[0],
        items: dayItems,
        users: dayUsers,
        revenue: dayRevenue,
        pageViews: Math.floor(Math.random() * 500) + 100
      });
    }

    // Status distribution
    const statusStats = await Item.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Priority distribution
    const priorityStats = await Item.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Top performing categories
    const topCategories = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          totalValue: { $sum: '$value' },
          averagePercentage: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      overview: {
        totalItems,
        totalUsers,
        activeItems,
        activeUsers,
        recentItems,
        recentUsers
      },
      growth: {
        sales: salesGrowth,
        users: userGrowth,
        pageVisits: pageVisitGrowth
      },
      categoryBreakdown: categoryStats,
      statusDistribution: statusStats,
      priorityDistribution: priorityStats,
      topCategories,
      chartData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
  }
});

// GET /api/dashboard/recent-activity - Get recent activity
router.get('/recent-activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent items
    const recentItems = await Item.find()
      .populate('createdBy', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Combine and sort by creation date
    const activities = [];

    recentItems.forEach(item => {
      activities.push({
        type: 'item',
        action: 'created',
        title: item.title,
        category: item.category,
        user: item.createdBy ? item.createdBy.username : 'Unknown',
        timestamp: item.createdAt,
        id: item._id
      });
    });

    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        action: 'registered',
        title: `${user.firstName} ${user.lastName}`,
        category: user.role,
        user: user.username,
        timestamp: user.createdAt,
        id: user._id
      });
    });

    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      activities: activities.slice(0, limit),
      total: activities.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activity', error: error.message });
  }
});

// GET /api/dashboard/analytics - Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const timeRange = req.query.range || '7d'; // 7d, 30d, 90d
    
    let startDate = new Date();
    switch (timeRange) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '7d':
      default:
        startDate.setDate(startDate.getDate() - 7);
        break;
    }

    // Items created over time
    const itemsOverTime = await Item.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Users registered over time
    const usersOverTime = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Performance metrics
    const performanceMetrics = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          averageValue: { $avg: '$value' },
          maxValue: { $max: '$value' },
          minValue: { $min: '$value' },
          totalValue: { $sum: '$value' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      timeRange,
      itemsOverTime,
      usersOverTime,
      performanceMetrics,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data', error: error.message });
  }
});

// GET /api/dashboard/calendar-data - Get calendar data for dashboard
router.get('/calendar-data', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get items created in the specified month
    const itemsInMonth = await Item.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).select('title category createdAt priority status');

    // Get users registered in the specified month
    const usersInMonth = await User.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).select('username firstName lastName createdAt role');

    // Create calendar data structure
    const calendarData = {};
    
    // Group items by day
    itemsInMonth.forEach(item => {
      const day = item.createdAt.getDate();
      if (!calendarData[day]) {
        calendarData[day] = { items: [], users: [], activities: 0 };
      }
      calendarData[day].items.push({
        title: item.title,
        category: item.category,
        priority: item.priority,
        status: item.status
      });
      calendarData[day].activities++;
    });

    // Group users by day
    usersInMonth.forEach(user => {
      const day = user.createdAt.getDate();
      if (!calendarData[day]) {
        calendarData[day] = { items: [], users: [], activities: 0 };
      }
      calendarData[day].users.push({
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role
      });
      calendarData[day].activities++;
    });

    res.json({
      year,
      month,
      calendarData,
      summary: {
        totalItems: itemsInMonth.length,
        totalUsers: usersInMonth.length,
        totalActivities: itemsInMonth.length + usersInMonth.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar data', error: error.message });
  }
});

module.exports = router;
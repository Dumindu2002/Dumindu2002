const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample analytics data
const analyticsData = {
  metrics: {
    sales: {
      value: '+95%',
      trend: 'up',
      previousValue: '45%',
      description: 'Sales growth compared to last month'
    },
    users: {
      value: '+70%',
      trend: 'up',
      previousValue: '35%',
      description: 'User acquisition rate'
    },
    pageViews: {
      value: '+10%',
      trend: 'up',
      previousValue: '5%',
      description: 'Page views increase'
    }
  },
  chartData: {
    salesChart: [
      { month: 'Jan', value: 65 },
      { month: 'Feb', value: 75 },
      { month: 'Mar', value: 85 },
      { month: 'Apr', value: 90 },
      { month: 'May', value: 95 },
      { month: 'Jun', value: 100 }
    ],
    userChart: [
      { week: 'Week 1', users: 120 },
      { week: 'Week 2', users: 150 },
      { week: 'Week 3', users: 180 },
      { week: 'Week 4', users: 200 }
    ]
  },
  tableData: [
    { id: 1, name: 'Dashboard Page', views: 1234, conversion: '5.2%', revenue: '$2,456' },
    { id: 2, name: 'Landing Page', views: 987, conversion: '3.8%', revenue: '$1,876' },
    { id: 3, name: 'Product Page', views: 756, conversion: '7.1%', revenue: '$3,234' },
    { id: 4, name: 'Contact Page', views: 432, conversion: '2.9%', revenue: '$876' },
    { id: 5, name: 'About Page', views: 321, conversion: '1.5%', revenue: '$456' }
  ],
  events: [
    { id: 1, type: 'User Registration', timestamp: new Date().toISOString(), user: 'john@example.com' },
    { id: 2, type: 'Purchase', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'jane@example.com' },
    { id: 3, type: 'Page View', timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'bob@example.com' }
  ]
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EvenRaw Analytics API is running' });
});

app.get('/api/analytics/metrics', (req, res) => {
  res.json({
    success: true,
    data: analyticsData.metrics
  });
});

app.get('/api/analytics/charts', (req, res) => {
  res.json({
    success: true,
    data: analyticsData.chartData
  });
});

app.get('/api/analytics/table', (req, res) => {
  res.json({
    success: true,
    data: analyticsData.tableData
  });
});

app.get('/api/analytics/events', (req, res) => {
  res.json({
    success: true,
    data: analyticsData.events
  });
});

app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      metrics: analyticsData.metrics,
      charts: analyticsData.chartData,
      table: analyticsData.tableData,
      events: analyticsData.events.slice(0, 5)
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EvenRaw Analytics API server running on port ${PORT}`);
  console.log(`📊 Dashboard API available at http://localhost:${PORT}/api/analytics/dashboard`);
});

module.exports = app;
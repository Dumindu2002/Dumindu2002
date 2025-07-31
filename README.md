# EvenRaw Dashboard Backend

A comprehensive Node.js/Express backend API for the EvenRaw business dashboard. This backend provides all the necessary endpoints to power a modern business management dashboard with features for bookings, customers, scheduling, messaging, invoicing, and feedback management.

## 🚀 Features

### Dashboard Analytics
- **Overview Metrics**: Sales, revenue, and customer growth statistics
- **Chart Data**: Customizable time-period analytics with trend visualization
- **Recent Activities**: Real-time updates on bookings, messages, and feedback
- **Calendar Integration**: Monthly booking calendar with appointment details

### Core Modules
- **👥 Customer Management**: Complete customer profiles with booking history
- **📅 Booking System**: Full appointment scheduling with status tracking
- **💬 Message Center**: Customer communication and inquiry management
- **🧾 Invoice Management**: Automated billing with payment tracking
- **⭐ Feedback System**: Customer reviews and satisfaction analytics
- **📊 Schedule Management**: Calendar view and availability checking

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin, Manager, and User roles
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation and sanitization

## 📋 API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
GET  /api/auth/me          - Get current user
PUT  /api/auth/profile     - Update profile
POST /api/auth/change-password - Change password
```

### Dashboard
```
GET /api/dashboard/overview        - Key metrics and statistics
GET /api/dashboard/chart-data      - Chart data for analytics
GET /api/dashboard/recent-activities - Recent system activities
GET /api/dashboard/calendar-data   - Calendar appointments
GET /api/dashboard/analytics       - Comprehensive analytics
```

### Bookings
```
GET    /api/bookings           - List all bookings (with filters)
GET    /api/bookings/:id       - Get booking details
POST   /api/bookings           - Create new booking
PUT    /api/bookings/:id       - Update booking
DELETE /api/bookings/:id       - Delete booking (Manager+)
PUT    /api/bookings/:id/status - Update booking status
```

### Customers
```
GET    /api/customers          - List all customers (with search)
GET    /api/customers/:id      - Get customer details
POST   /api/customers          - Create new customer
PUT    /api/customers/:id      - Update customer
DELETE /api/customers/:id      - Delete customer (Manager+)
GET    /api/customers/:id/stats - Customer statistics
```

### Messages
```
GET  /api/messages              - List all messages (with filters)
GET  /api/messages/:id          - Get message details
POST /api/messages/:id/reply    - Reply to message
PUT  /api/messages/:id/status   - Update message status
```

### Invoices
```
GET  /api/invoices              - List all invoices (with filters)
GET  /api/invoices/:id          - Get invoice details
POST /api/invoices              - Create new invoice
PUT  /api/invoices/:id          - Update invoice
PUT  /api/invoices/:id/payment  - Record payment
DELETE /api/invoices/:id        - Delete invoice (Manager+)
```

### Feedback
```
GET  /api/feedbacks             - List all feedback (with filters)
GET  /api/feedbacks/:id         - Get feedback details
POST /api/feedbacks             - Create new feedback
POST /api/feedbacks/:id/response - Respond to feedback
PUT  /api/feedbacks/:id/helpful - Mark as helpful
GET  /api/feedbacks/stats/summary - Feedback statistics
```

### Schedule
```
GET /api/schedule               - Get schedule data
GET /api/schedule/availability  - Check time slot availability
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd evenraw-dashboard-backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update the values:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/evenraw_dashboard
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### 3. Database Setup
Make sure MongoDB is running, then seed the database with demo data:
```bash
npm run seed
```

### 4. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3000`

## 🔐 Demo Credentials

After running the seed script, you can use these demo accounts:

- **Admin**: `admin@evenraw.com` / `admin123`
- **Manager**: `manager@evenraw.com` / `manager123`
- **Staff**: `staff@evenraw.com` / `staff123`

## 📊 Demo Data

The seeding script creates:
- **3 Users** (Admin, Manager, Staff)
- **50 Customers** with realistic profiles
- **200 Bookings** across different time periods and statuses
- **75 Messages** from customers with various priorities
- **80 Invoices** with different payment statuses
- **60 Feedback entries** with ratings and comments

## 🏗️ Project Structure

```
├── config/
│   └── database.js         # MongoDB connection
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # User model
│   ├── Customer.js        # Customer model
│   ├── Booking.js         # Booking model
│   ├── Message.js         # Message model
│   ├── Invoice.js         # Invoice model
│   └── Feedback.js        # Feedback model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── dashboard.js       # Dashboard API routes
│   ├── bookings.js        # Booking management
│   ├── customers.js       # Customer management
│   ├── messages.js        # Message handling
│   ├── invoices.js        # Invoice management
│   ├── feedbacks.js       # Feedback system
│   └── schedule.js        # Schedule management
├── scripts/
│   └── seedData.js        # Database seeding script
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔧 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with demo data
```

## 🚦 Health Check

The API includes a health check endpoint:
```
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

## 📈 Dashboard Metrics

The dashboard provides key business metrics:

- **Sales Growth**: Percentage change in bookings
- **Revenue Tracking**: Income analysis with period comparisons  
- **Customer Acquisition**: New customer registration trends
- **Service Performance**: Popular services and customer satisfaction
- **Operational Insights**: Booking patterns and staff utilization

## 🛡️ Security Features

- **JWT Token Authentication**: Secure stateless authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Cross-origin request management
- **Input Validation**: Mongoose schema validation
- **Role-based Permissions**: Granular access control

## 🌐 Frontend Integration

This backend is designed to work with modern frontend frameworks:

- **RESTful API**: Standard HTTP methods and status codes
- **JSON Responses**: Consistent data format
- **CORS Enabled**: Ready for frontend integration
- **Pagination Support**: Built-in pagination for large datasets
- **Filter & Search**: Advanced querying capabilities

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Update all `.env` values for production
2. **Database**: Use MongoDB Atlas or dedicated MongoDB instance
3. **Security**: Change JWT secret and enable additional security headers
4. **Monitoring**: Add logging and monitoring solutions
5. **SSL/TLS**: Enable HTTPS for secure communication

## 📞 Support

For questions or support regarding the EvenRaw Dashboard Backend, please refer to the API documentation or contact the development team.

---

**Built with ❤️ for modern business management**

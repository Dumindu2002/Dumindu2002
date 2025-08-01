# DashCRUD - Full-Stack Dashboard Application

A modern, full-stack dashboard application with complete CRUD functionality, built with React, TypeScript, Node.js, Express, and MongoDB. The application features a beautiful, responsive UI matching modern dashboard designs with comprehensive user and item management capabilities.

## 🚀 Features

### 📊 Dashboard
- **Interactive Statistics Cards** - Display key metrics with +95% Sales, +70% Users, +10% Page visits
- **Performance Charts** - Real-time data visualization with Recharts
- **Calendar Widget** - Interactive calendar with activity indicators
- **Recent Activity Feed** - Live updates of user and item activities

### 🔐 Authentication & Authorization
- **User Registration & Login** - Secure JWT-based authentication
- **Role-based Access Control** - Admin, Manager, and User roles
- **Protected Routes** - Secure access to dashboard features
- **Password Security** - Bcrypt hashing with salt

### 📋 CRUD Operations
- **Items Management** - Complete CRUD for dashboard items
- **Users Management** - Admin-only user management
- **Search & Filtering** - Advanced search and filtering capabilities
- **Bulk Operations** - Select and manage multiple items
- **Real-time Updates** - Instant UI updates after operations

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on all device sizes
- **Beautiful Gradients** - Modern color schemes and smooth transitions
- **Interactive Elements** - Hover effects and smooth animations
- **Toast Notifications** - User-friendly success/error messages
- **Loading States** - Smooth loading indicators

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Styled Components** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests
- **Express middleware** for request handling

## 📁 Project Structure

```
dashboard-crud-app/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Auth/        # Authentication components
│   │   │   ├── Dashboard/   # Dashboard components
│   │   │   ├── Items/       # Item management
│   │   │   ├── Users/       # User management
│   │   │   └── Layout/      # Layout components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── App.tsx
│   └── package.json
├── server/                   # Node.js backend
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Install server dependencies**
   ```bash
   npm install
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update MongoDB connection string
   - Set JWT secret key

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📋 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Items Management
- `GET /api/items` - Get all items (with pagination & filtering)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `PATCH /api/items/:id` - Partial update
- `DELETE /api/items/:id` - Delete item
- `DELETE /api/items` - Bulk delete items

### Users Management (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activity
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/dashboard/calendar-data` - Get calendar data

## 🔧 Configuration

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dashboard-crud
JWT_SECRET=your-super-secret-jwt-key
REACT_APP_API_URL=http://localhost:5000/api
```

### MongoDB Setup
1. **Local MongoDB**: Install MongoDB Community Server
2. **MongoDB Atlas**: Create a free cluster and get connection string
3. Update `MONGODB_URI` in `.env` file

## 🎯 Usage

### Getting Started
1. **Register a new account** or use demo credentials
2. **Login** to access the dashboard
3. **Explore features**:
   - View dashboard statistics and charts
   - Manage items (create, read, update, delete)
   - Admin users can manage other users
   - Use search and filtering capabilities

### User Roles
- **Admin**: Full access to all features including user management
- **Manager**: Access to items management and dashboard
- **User**: Read-only access to dashboard

### Demo Data
The application includes sample data generation for:
- Dashboard statistics
- Chart data points
- Activity indicators
- Calendar events

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt
- **Role-based Authorization** for protected routes
- **Input Validation** on both client and server
- **CORS Configuration** for secure cross-origin requests
- **Error Handling** with proper status codes

## 🎨 Design Features

- **Modern Dashboard Design** matching contemporary UI standards
- **Gradient Backgrounds** with smooth color transitions
- **Interactive Cards** with hover effects and animations
- **Responsive Grid Layouts** adapting to all screen sizes
- **Color-coded Categories** for better visual organization
- **Loading States** for improved user experience

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy server folder
```

### Database
- Use MongoDB Atlas for production
- Set up database indexes for performance

## 🧪 Testing

```bash
# Run server tests
npm test

# Run client tests
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** - Frontend framework
- **Express.js** - Backend framework
- **MongoDB** - Database
- **Styled Components** - CSS-in-JS styling
- **Recharts** - Chart library
- **Lucide React** - Icon library

## 📞 Support

For support, email support@dashcrud.com or create an issue in the GitHub repository.

---

**Built with ❤️ by Dumindu2002**

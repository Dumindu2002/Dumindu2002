const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database connection');
    console.log('📋 To enable full functionality:');
    console.log('   1. Install MongoDB');
    console.log('   2. Start MongoDB service');
    console.log('   3. Restart the server');
    // Don't exit the process, allow server to run without DB for testing
  }
};

module.exports = connectDB;
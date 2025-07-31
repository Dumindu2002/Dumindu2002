const mongoose = require('mongoose');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Models
const User = require('../models/User');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const Invoice = require('../models/Invoice');
const Feedback = require('../models/Feedback');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📦 MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Sample data
const services = [
  'Hair Cut & Styling',
  'Hair Coloring',
  'Deep Cleansing Facial',
  'Anti-Aging Treatment',
  'Manicure & Pedicure',
  'Eyebrow Threading',
  'Hair Treatment',
  'Wedding Makeup',
  'Bridal Package',
  'Massage Therapy'
];

const sampleUsers = [
  {
    name: 'John Admin',
    email: 'admin@evenraw.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Sarah Manager',
    email: 'manager@evenraw.com',
    password: 'manager123',
    role: 'manager'
  },
  {
    name: 'Mike Staff',
    email: 'staff@evenraw.com',
    password: 'staff123',
    role: 'user'
  }
];

const generateCustomers = (count) => {
  const customers = [];
  const firstNames = ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Mason', 'Michael', 'Ethan', 'Daniel'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    customers.push({
      customerId: `CU-${uuidv4().substring(0, 8).toUpperCase()}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        city: 'New York',
        state: 'NY',
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'USA'
      },
      dateOfBirth: moment().subtract(Math.floor(Math.random() * 50) + 18, 'years').toDate(),
      preferences: services.slice(0, Math.floor(Math.random() * 3) + 1),
      isActive: Math.random() > 0.1 // 90% active
    });
  }
  
  return customers;
};

const generateBookings = (customers, users, count) => {
  const bookings = [];
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const weights = [0.2, 0.3, 0.4, 0.1]; // Probability weights
  
  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const assignedTo = users[Math.floor(Math.random() * users.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    
    // Generate random date within last 3 months and next 1 month
    const randomDays = Math.floor(Math.random() * 120) - 90; // -90 to +30 days
    const date = moment().add(randomDays, 'days').toDate();
    
    // Random time
    const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    // Select status based on weights
    const random = Math.random();
    let cumulativeWeight = 0;
    let status = 'pending';
    
    for (let j = 0; j < weights.length; j++) {
      cumulativeWeight += weights[j];
      if (random <= cumulativeWeight) {
        status = statuses[j];
        break;
      }
    }
    
    bookings.push({
      bookingId: `BK-${uuidv4().substring(0, 8).toUpperCase()}`,
      customer: customer._id,
      service,
      date,
      startTime,
      endTime,
      status,
      price: Math.floor(Math.random() * 200) + 50, // $50-$250
      notes: Math.random() > 0.7 ? 'Special requirements discussed' : '',
      assignedTo: assignedTo._id,
      createdAt: moment(date).subtract(Math.floor(Math.random() * 7), 'days').toDate()
    });
  }
  
  return bookings;
};

const generateMessages = (customers, count) => {
  const messages = [];
  const subjects = [
    'Booking Inquiry',
    'Service Question',
    'Appointment Reschedule',
    'Feedback on Service',
    'Payment Issue',
    'Special Request',
    'Cancellation Request',
    'Complaint',
    'Thank You Note',
    'Product Inquiry'
  ];
  
  const contents = [
    'Hi, I would like to book an appointment for next week.',
    'Could you please provide more information about your services?',
    'I need to reschedule my appointment due to an emergency.',
    'The service was excellent! Thank you for the great experience.',
    'I had an issue with my payment, could you help me resolve it?',
    'I have some special requirements for my appointment.',
    'I need to cancel my upcoming appointment.',
    'I was not satisfied with the service quality.',
    'Thank you for the wonderful service!',
    'Do you have any new products available?'
  ];
  
  const types = ['inquiry', 'complaint', 'feedback', 'support', 'general'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['unread', 'read', 'replied', 'resolved'];
  
  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    
    messages.push({
      messageId: `MSG-${uuidv4().substring(0, 8).toUpperCase()}`,
      sender: customer._id,
      subject,
      content,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: moment().subtract(Math.floor(Math.random() * 30), 'days').toDate()
    });
  }
  
  return messages;
};

const generateInvoices = (customers, bookings, count) => {
  const invoices = [];
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  for (let i = 0; i < Math.min(count, completedBookings.length); i++) {
    const booking = completedBookings[i];
    const customer = customers.find(c => c._id.equals(booking.customer));
    
    const items = [{
      description: booking.service,
      quantity: 1,
      unitPrice: booking.price,
      total: booking.price
    }];
    
    const subtotal = booking.price;
    const taxRate = 8.5; // 8.5%
    const taxAmount = Math.round(subtotal * taxRate / 100);
    const total = subtotal + taxAmount;
    
    const statuses = ['draft', 'sent', 'paid', 'overdue'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    invoices.push({
      invoiceNumber: `INV-${moment().format('YYYYMM')}-${uuidv4().substring(0, 6).toUpperCase()}`,
      customer: customer._id,
      booking: booking._id,
      items,
      subtotal,
      tax: {
        rate: taxRate,
        amount: taxAmount
      },
      discount: 0,
      total,
      status,
      dueDate: moment(booking.date).add(30, 'days').toDate(),
      paidDate: status === 'paid' ? moment(booking.date).add(Math.floor(Math.random() * 20), 'days').toDate() : undefined,
      paymentMethod: status === 'paid' ? ['cash', 'card', 'bank_transfer'][Math.floor(Math.random() * 3)] : undefined,
      createdAt: moment(booking.date).add(1, 'day').toDate()
    });
  }
  
  return invoices;
};

const generateFeedbacks = (customers, bookings, count) => {
  const feedbacks = [];
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  const titles = [
    'Excellent Service!',
    'Very Professional',
    'Great Experience',
    'Highly Recommend',
    'Outstanding Quality',
    'Perfect Results',
    'Amazing Staff',
    'Love the Results',
    'Will Come Back',
    'Fantastic Service'
  ];
  
  const comments = [
    'The service was absolutely wonderful. The staff was professional and friendly.',
    'I am very satisfied with the quality of service. Will definitely come back!',
    'Excellent experience from start to finish. Highly recommended!',
    'The team was amazing and the results exceeded my expectations.',
    'Professional service with great attention to detail.',
    'Very happy with the service and the staff was so friendly.',
    'Outstanding quality and service. Worth every penny!',
    'The best salon experience I have ever had. Thank you!',
    'Amazing results and great customer service.',
    'Perfect service and professional staff. Highly recommend!'
  ];
  
  const categories = ['service', 'staff', 'facility', 'pricing', 'overall'];
  
  for (let i = 0; i < Math.min(count, completedBookings.length); i++) {
    const booking = completedBookings[i];
    const customer = customers.find(c => c._id.equals(booking.customer));
    
    feedbacks.push({
      feedbackId: `FB-${uuidv4().substring(0, 8).toUpperCase()}`,
      customer: customer._id,
      booking: booking._id,
      rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating (mostly positive)
      title: titles[Math.floor(Math.random() * titles.length)],
      comment: comments[Math.floor(Math.random() * comments.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      isPublic: Math.random() > 0.2, // 80% public
      tags: ['service', 'quality', 'professional'].slice(0, Math.floor(Math.random() * 3) + 1),
      createdAt: moment(booking.date).add(Math.floor(Math.random() * 7) + 1, 'days').toDate()
    });
  }
  
  return feedbacks;
};

const clearDatabase = async () => {
  console.log('🗑️ Clearing existing data...');
  await User.deleteMany({});
  await Customer.deleteMany({});
  await Booking.deleteMany({});
  await Message.deleteMany({});
  await Invoice.deleteMany({});
  await Feedback.deleteMany({});
  console.log('✅ Database cleared');
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    console.log('🌱 Starting database seeding...');
    
    // Create users
    console.log('👥 Creating users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);
    
    // Create customers
    console.log('👤 Creating customers...');
    const customerData = generateCustomers(50);
    const customers = await Customer.insertMany(customerData);
    console.log(`✅ Created ${customers.length} customers`);
    
    // Create bookings
    console.log('📅 Creating bookings...');
    const bookingData = generateBookings(customers, users, 200);
    const bookings = await Booking.insertMany(bookingData);
    console.log(`✅ Created ${bookings.length} bookings`);
    
    // Create messages
    console.log('💬 Creating messages...');
    const messageData = generateMessages(customers, 75);
    const messages = await Message.insertMany(messageData);
    console.log(`✅ Created ${messages.length} messages`);
    
    // Create invoices
    console.log('🧾 Creating invoices...');
    const invoiceData = generateInvoices(customers, bookings, 80);
    const invoices = await Invoice.insertMany(invoiceData);
    console.log(`✅ Created ${invoices.length} invoices`);
    
    // Create feedbacks
    console.log('⭐ Creating feedbacks...');
    const feedbackData = generateFeedbacks(customers, bookings, 60);
    const feedbacks = await Feedback.insertMany(feedbackData);
    console.log(`✅ Created ${feedbacks.length} feedbacks`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Dashboard Demo Data Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Customers: ${customers.length}`);
    console.log(`   Bookings: ${bookings.length}`);
    console.log(`   Messages: ${messages.length}`);
    console.log(`   Invoices: ${invoices.length}`);
    console.log(`   Feedbacks: ${feedbacks.length}`);
    
    console.log('\n🔐 Demo Login Credentials:');
    console.log('   Admin: admin@evenraw.com / admin123');
    console.log('   Manager: manager@evenraw.com / manager123');
    console.log('   Staff: staff@evenraw.com / staff123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
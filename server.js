const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
            connectSrc: ["'self'", "https://api.stripe.com"],
            frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"]
        }
    }
}));
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes for future expansion
app.get('/api/products', (req, res) => {
    // This would typically fetch from a database
    const products = [
        {
            id: 1,
            name: "Artisan Sourdough Bread",
            price: 8.99,
            image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Traditional sourdough with a crispy crust and tangy flavor",
            category: "bread",
            inStock: true
        },
        // Add more products here...
    ];
    
    res.json(products);
});

// Payment processing endpoint (demo)
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        // This is where you would integrate with Stripe
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        const { amount, currency = 'usd' } = req.body;
        
        // Demo response - replace with actual Stripe integration
        res.json({
            clientSecret: 'demo_client_secret',
            amount: amount,
            currency: currency
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order processing endpoint
app.post('/api/orders', async (req, res) => {
    try {
        const { customerData, items, total, paymentMethodId } = req.body;
        
        // Here you would:
        // 1. Validate the order data
        // 2. Process payment with Stripe
        // 3. Save order to database
        // 4. Send confirmation email
        // 5. Return order confirmation
        
        const orderNumber = 'SD' + Date.now().toString().slice(-8);
        
        res.json({
            success: true,
            orderNumber: orderNumber,
            message: 'Order processed successfully',
            estimatedDelivery: customerData.deliveryDate
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Sweet Dreams Bakery API'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🍰 Sweet Dreams Bakery server is running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
    console.log(`📱 Mobile friendly and responsive design`);
    console.log(`💳 Payment gateway ready (configure Stripe keys)`);
});

module.exports = app;
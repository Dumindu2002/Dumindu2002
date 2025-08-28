# 🍰 Sweet Dreams Bakery

A modern, responsive bakery website with online ordering system and integrated payment gateway using Stripe.

## ✨ Features

- **Beautiful Modern Design**: Responsive design that works on all devices
- **Product Catalog**: Browse various bakery items (breads, pastries, cakes, cookies)
- **Shopping Cart**: Add/remove items, adjust quantities
- **Secure Checkout**: Multi-step checkout process with customer information
- **Payment Gateway**: Integrated Stripe payment processing
- **Order Management**: Order confirmation and receipt system
- **Mobile Friendly**: Fully responsive design for mobile and desktop

## 🚀 Live Demo

Open `index.html` in your browser to see the bakery website in action!

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Stripe account (for payment processing)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-dreams-bakery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file and add your Stripe keys:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Development Mode
```bash
npm run dev
```

## 🏗️ Project Structure

```
sweet-dreams-bakery/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── server.js           # Express.js server
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
└── README.md          # This file
```

## 🎨 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Payment**: Stripe API
- **Styling**: Custom CSS with Flexbox/Grid
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Playfair Display, Open Sans)

## 💳 Payment Integration

The website uses Stripe for secure payment processing:

1. **Get Stripe Keys**: Sign up at [stripe.com](https://stripe.com)
2. **Test Mode**: Use test keys for development
3. **Test Cards**: Use `4242 4242 4242 4242` for testing
4. **Production**: Replace with live keys for production

## 🛒 Order Process

1. **Browse Products**: View bakery items by category
2. **Add to Cart**: Select items and quantities
3. **Customer Info**: Enter delivery details
4. **Payment**: Secure payment with Stripe
5. **Confirmation**: Order receipt and confirmation

## 📱 Responsive Design

The website is fully responsive and includes:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized images
- Hamburger menu for mobile

## 🔧 Customization

### Adding New Products
Edit the `products` array in `script.js`:
```javascript
{
    id: 13,
    name: "New Product",
    price: 9.99,
    image: "image-url",
    description: "Product description",
    category: "category-name"
}
```

### Styling Changes
Modify `styles.css` to customize:
- Colors and fonts
- Layout and spacing
- Responsive breakpoints
- Animations and effects

### Business Information
Update contact details in `index.html`:
- Address, phone, email
- Business hours
- Social media links

## 🚀 Deployment

### Static Hosting (GitHub Pages, Netlify, Vercel)
1. Push code to repository
2. Connect to hosting service
3. Configure environment variables
4. Deploy

### Server Hosting (Heroku, Railway, DigitalOcean)
1. Set up hosting account
2. Configure environment variables
3. Deploy with Git or Docker
4. Configure domain (optional)

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation
- Secure payment processing
- Environment variable protection

## 📞 Support

For support or questions:
- Email: orders@sweetdreamsbakery.com
- Phone: (555) 123-BAKE

## 📄 License

MIT License - feel free to use this project for your own bakery business!

## 🎯 Future Enhancements

- [ ] User accounts and order history
- [ ] Admin dashboard for inventory management
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Loyalty program
- [ ] Subscription boxes
- [ ] Multi-language support
- [ ] Advanced analytics

---

Made with ❤️ for Sweet Dreams Bakery

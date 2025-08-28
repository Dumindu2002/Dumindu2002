// Global Variables
let cart = [];
let currentStep = 1;
let stripe;
let elements;
let cardElement;

// Bakery Products Data
const products = [
    {
        id: 1,
        name: "Artisan Sourdough Bread",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Traditional sourdough with a crispy crust and tangy flavor",
        category: "bread"
    },
    {
        id: 2,
        name: "Chocolate Croissant",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1623334044303-241021148842?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Buttery pastry filled with rich dark chocolate",
        category: "pastries"
    },
    {
        id: 3,
        name: "Red Velvet Cake",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Moist red velvet cake with cream cheese frosting",
        category: "cakes"
    },
    {
        id: 4,
        name: "Chocolate Chip Cookies",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Dozen freshly baked chocolate chip cookies",
        category: "cookies"
    },
    {
        id: 5,
        name: "French Baguette",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Crispy French baguette perfect for any meal",
        category: "bread"
    },
    {
        id: 6,
        name: "Blueberry Muffin",
        price: 2.99,
        image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Fluffy muffin packed with fresh blueberries",
        category: "pastries"
    },
    {
        id: 7,
        name: "Birthday Cake",
        price: 52.99,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Custom birthday cake with your choice of flavors",
        category: "cakes"
    },
    {
        id: 8,
        name: "Sugar Cookies",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Decorated sugar cookies perfect for any occasion",
        category: "cookies"
    },
    {
        id: 9,
        name: "Whole Wheat Bread",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Healthy whole wheat bread with seeds and grains",
        category: "bread"
    },
    {
        id: 10,
        name: "Almond Croissant",
        price: 4.25,
        image: "https://images.unsplash.com/photo-1555507036-ab794f636bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Flaky croissant filled with sweet almond cream",
        category: "pastries"
    },
    {
        id: 11,
        name: "Cheesecake",
        price: 38.99,
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Creamy New York style cheesecake with berry topping",
        category: "cakes"
    },
    {
        id: 12,
        name: "Oatmeal Cookies",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1618923848764-7b17bb305c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Hearty oatmeal cookies with raisins and cinnamon",
        category: "cookies"
    }
];

// Initialize Stripe (Replace with your actual publishable key)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_demo_key_for_testing'; // Demo key - replace with real key

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProducts();
    setupEventListeners();
    setMinDeliveryDate();
});

// Initialize Application
function initializeApp() {
    // Initialize Stripe
    try {
        if (typeof Stripe !== 'undefined' && STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY !== 'pk_test_demo_key_for_testing') {
            stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            elements = stripe.elements();
            
            // Create card element
            cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                },
            });
        } else {
            console.log('Stripe not configured - using demo mode');
        }
    } catch (error) {
        console.log('Stripe initialization failed - using demo mode:', error.message);
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('bakeryCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Set minimum delivery date to tomorrow
function setMinDeliveryDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    document.getElementById('deliveryDate').min = dateString;
    document.getElementById('deliveryDate').value = dateString;
}

// Load Products
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Category filters
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadProducts(btn.dataset.category);
        });
    });

    // Customer form submission
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerFormSubmit);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCheckout();
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to Products Section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    saveCart();
    
    // Show success message
    showMessage('Product added to cart!', 'success');
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    const total = calculateTotal();
    cartTotal.textContent = total.toFixed(2);
    
    // Enable/disable checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Create Cart Item
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `;
    return cartItem;
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
    showMessage('Item removed from cart', 'success');
}

// Calculate Total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

// Proceed to Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('overlay');
    
    // Close cart sidebar
    toggleCart();
    
    // Show checkout modal
    modal.classList.add('show');
    overlay.classList.add('show');
    
    // Reset to step 1
    showCheckoutStep(1);
}

// Show Checkout Step
function showCheckoutStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.add('hidden'));
    
    // Show current step
    document.getElementById(`step${step}`).classList.remove('hidden');
    
    currentStep = step;
    
    if (step === 2) {
        setupPaymentForm();
        displayOrderSummary();
    }
}

// Handle Customer Form Submit
function handleCustomerFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Store customer data
    const customerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        specialInstructions: document.getElementById('specialInstructions').value
    };
    
    localStorage.setItem('customerData', JSON.stringify(customerData));
    
    // Move to payment step
    showCheckoutStep(2);
}

// Setup Payment Form
function setupPaymentForm() {
    if (!cardElement) {
        // Demo mode - show demo payment form
        const cardElementContainer = document.getElementById('card-element');
        cardElementContainer.innerHTML = `
            <div style="padding: 1rem; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 0.375rem;">
                <p style="margin: 0; color: #6c757d; font-size: 0.9rem;">
                    <strong>Demo Mode:</strong> Enter any test card number (e.g., 4242 4242 4242 4242)
                </p>
                <input type="text" placeholder="Card Number" style="width: 100%; margin-top: 0.5rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <input type="text" placeholder="MM/YY" style="flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                    <input type="text" placeholder="CVC" style="flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                </div>
            </div>
        `;
        return;
    }
    
    // Mount Stripe card element
    const cardElementContainer = document.getElementById('card-element');
    cardElementContainer.innerHTML = '';
    cardElement.mount('#card-element');
    
    // Listen for card element changes
    cardElement.on('change', ({error}) => {
        const displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    // Setup payment button
    const submitButton = document.getElementById('submit-payment');
    submitButton.addEventListener('click', handlePayment);
}

// Display Order Summary
function displayOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const finalTotal = document.getElementById('finalTotal');
    
    orderSummary.innerHTML = '';
    
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummary.appendChild(summaryItem);
    });
    
    const total = calculateTotal();
    finalTotal.textContent = total.toFixed(2);
}

// Handle Payment
async function handlePayment() {
    const submitButton = document.getElementById('submit-payment');
    const spinner = submitButton.querySelector('.spinner');
    const buttonText = submitButton.querySelector('span');
    
    // Show loading state
    submitButton.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.textContent = 'Processing...';
    
    try {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (!cardElement) {
            // Demo mode - simulate successful payment
            processSuccessfulPayment();
            return;
        }
        
        // Real Stripe payment processing
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Here you would send the payment method to your server
        // For demo purposes, we'll simulate success
        processSuccessfulPayment();
        
    } catch (error) {
        showMessage(`Payment failed: ${error.message}`, 'error');
        
        // Reset button state
        submitButton.disabled = false;
        spinner.classList.add('hidden');
        buttonText.textContent = 'Pay Now';
    }
}

// Process Successful Payment
function processSuccessfulPayment() {
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Get customer data
    const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
    
    // Create order details
    const orderDetails = {
        orderNumber,
        customerData,
        items: cart,
        total: calculateTotal(),
        orderDate: new Date().toLocaleDateString(),
        deliveryDate: customerData.deliveryDate
    };
    
    // Display order confirmation
    displayOrderConfirmation(orderDetails);
    
    // Clear cart
    cart = [];
    localStorage.removeItem('bakeryCart');
    localStorage.removeItem('customerData');
    updateCartUI();
    
    // Move to success step
    showCheckoutStep(3);
}

// Generate Order Number
function generateOrderNumber() {
    return 'SD' + Date.now().toString().slice(-8);
}

// Display Order Confirmation
function displayOrderConfirmation(orderDetails) {
    const orderDetailsDiv = document.getElementById('orderDetails');
    
    orderDetailsDiv.innerHTML = `
        <h4>Order #${orderDetails.orderNumber}</h4>
        <p><strong>Customer:</strong> ${orderDetails.customerData.firstName} ${orderDetails.customerData.lastName}</p>
        <p><strong>Email:</strong> ${orderDetails.customerData.email}</p>
        <p><strong>Delivery Date:</strong> ${new Date(orderDetails.customerData.deliveryDate).toLocaleDateString()}</p>
        <p><strong>Delivery Address:</strong> ${orderDetails.customerData.address}</p>
        <p><strong>Total Amount:</strong> $${orderDetails.total.toFixed(2)}</p>
        <div style="margin-top: 1rem;">
            <strong>Items Ordered:</strong>
            <ul style="margin-top: 0.5rem;">
                ${orderDetails.items.map(item => 
                    `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
                ).join('')}
            </ul>
        </div>
    `;
}

// Start New Order
function startNewOrder() {
    closeCheckout();
    scrollToProducts();
}

// Close Checkout
function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('overlay');
    
    modal.classList.remove('show');
    overlay.classList.remove('show');
    
    // Reset to step 1
    showCheckoutStep(1);
    
    // Clear forms
    document.getElementById('customerForm').reset();
    setMinDeliveryDate();
}

// Show Message
function showMessage(text, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at top of page
    document.body.insertBefore(message, document.body.firstChild);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Utility Functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .about-content, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateOnScroll, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu if open
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// Export functions for global access (if needed)
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.proceedToCheckout = proceedToCheckout;
window.closeCheckout = closeCheckout;
window.startNewOrder = startNewOrder;
window.scrollToProducts = scrollToProducts;
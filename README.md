# GreenVille Ecommerce Shop Project

<p align="center">
  <img src="https://github.com/shadowofleaf96/GreenVille/blob/main/client/public/assets/logo.webp?raw=true" alt="GreenVille Logo" width="180"/>
</p>

Welcome to GreenVille, an open-source MERN (MongoDB, Express.js, React.js, Node.js) stack ecommerce shop project. GreenVille is designed to provide a foundation for building a robust and scalable online bio Organic store. Whether you're a developer looking to learn MERN stack or an entrepreneur planning to kickstart your ecommerce venture, GreenVille is a great starting point.

GreenVille is a bio-organic eCommerce store that offers eco-friendly products, connecting customers with sustainable options. Built using modern web technologies, it focuses on providing an intuitive shopping experience for organic goods. The project includes features like inventory management, secure payment options, and a user-friendly interface, designed to promote green living.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contributing](#contributing)

## Features

### 🛒 Frontoffice (Customer-Facing Features)

* **Responsive Design:** 
    * Fully responsive user interface optimized for desktop and mobile.

* **Global Image Optimization:**
    * All images (products, banners, logos, etc.) are served from **Cloudinary** for optimized performance. 
    * Cloudinary automatically handles image resizing, format conversion, and compression to ensure fast load times across all pages.
    * Optimized images are applied across the **Product Listings**, **Product Details**, **About Page**, **Contact Page**, etc.

* **Global SEO Optimization using Helmet:**
    * **react-helmet** is used across all pages (Product Listings, Product Details, Contact, About, etc.) to set dynamic metadata such as titles, descriptions for SEO purposes.
    * **SEO Title Tags and Meta Descriptions** are automatically updated based on the page content (e.g., Product Name, Categories).

* **Product Listings:**
    * Browse products by categories and subcategory.
    * Advanced filtering options (price, option).
    * Sorting Products by name and price (a to z and z to a, low to high and high to low)

* **Product Details Page:**
    * Detailed product descriptions (short description and product description), Translated title, Rating.
    * Add to cart or buy immediately.
    * Product Commentary with account name and comment.
    * Real-time stock availability.

* **Shopping Cart:**
    * Add/remove items.
    * Dynamic cart updates with price calculation.
    * **Redux Integration:** Cart information is saved and managed using Redux, ensuring that cart state persists across page reloads and provides a seamless user experience.

* **Checkout System:**
    * Secure order placement.
    * Option to save shipping address to be used later.
    * **Coupon Support:** Apply discount coupons during checkout.
    * Integration with payment gateways (Cash on Delivery, PayPal, Stripe).

* **User Authentication:**
    * Register, log in, and manage profiles (edit customer info, edit shipping address).
    * Password reset functionality.
    * Google Login integration for quick authentication.
    * **reCAPTCHA v3 Integration:** Added to login and register forms to prevent bot attacks.

* **Order Tracking:**
    * View order history, detailed information, and status updates.
    * **Review and Rating:** Submit reviews and rate products for completed orders.

* **Search Functionality:**
    * Search for products by name directly from the navigation bar.

* **Contact Page:**
    * Contact form for inquiries with validation.
    * Embedded Google Maps showing store location(s).
    * Company information (address, phone, email, etc.).

* **About Page:**
    * Dedicated page to describe the company’s mission, vision, and history.

* **Multi-Language Support:**
    * Languages supported: English (EN), French (FR), and Arabic (AR).
    * Implemented using **i18n** for seamless language switching.

## Admin Panel Features

**🛠 Frontend**

* **Dashboard**
    * Overview of sales, orders, customers, revenues from the sales, and New Orders performance metrics.
* **Profile**
    * Overview of user info (Admin or Manager).
* **Product Management**
    * Add, edit, and delete products.
    * Set product name, short description, and long description in 3 languages (EN, FR, AR).
    * Manage product categories and subcategories.
    * Upload and optimize product images with Cloudinary.
    * Set SKU, product price, stock levels, options, and status.
    * **Search and Filter:**
        * Search products by name.
        * Filter products by SKU, price, or quantity.
        * Advanced sorting.
* **Order Management**
    * View all orders with detailed information (products, quantities, shipping addresses).
    * Delete or modify customer orders.
    * Update order shipping statuses (Not Shipped, Shipped, Delivered, In Transit).
    * Export Order as Invoice PDF
    * View order history for each customer.
    * **Search and Filter:**
        * Search orders by customer name.
        * Filter orders by items or total price.
        * Advanced sorting.
* **User Management**
    * View, add, manage, and delete internal user accounts.
    * Assign admin roles for role-based access control.
    * Search and filter users by name or email.
    * Advanced sorting.
* **Customer Management**
    * View and edit customer details and shipping addresses.
    * Disable or delete customer accounts.
    * **Search and Filter:**
        * Search customers by name.
        * Filter by email or name.
        * Advanced sorting.
* **Category and Subcategory Management**
    * Create, edit, and delete product categories/subcategories.
    * Manage multilingual names (EN, FR, AR) and link products.
    * Enable/disable categories and subcategories.
    * Advanced sorting.
* **Coupon Management**
    * Create, edit, and delete discount coupons.
    * Define discount percentage, expiration date, usage limit, and status.
    * Search coupons by code with advanced sorting.
* **Payment List Management**
    * View, edit, and delete payments.
    * Track payment methods (Stripe, PayPal, Cash on Delivery).
    * Filter payments by method, total, or customer name.
    * Advanced sorting.
* **Review and Contact Management**
    * Manage product reviews and customer contact form submissions.
    * Reply to inquiries directly from the panel.
    * Search and sort reviews/messages by name or product.
* **Form Handling**
    * **React Hook Form:**
        * Manage forms for adding/editing products, categories, orders, etc.
        * Display validation errors dynamically to users.
    * **Data Sanitization:**
        * Use DOMPurify to clean all user-input fields to prevent XSS attacks.
        * Applied to product descriptions, reviews, and contact messages.
* **Multi-Language Support**
    * Seamless switching between EN, FR, and AR using i18n.

**🖧 Backend**

* **RESTful API**
    * Built with Express.js for efficient communication between frontend and backend.
    * **Secure Endpoints:** All endpoints require proper authentication and role-based authorization.
* **Database**
    * MongoDB database with models for users, products, orders, inventory, and reviews.
* **Email Sending**
    * **Nodemailer:** 
        * Used for sending transactional emails (order confirmations, password resets, contact forms).
        * Supports various email providers (Gmail, SMTP, etc.).
        * Templates can be used for creating customized email layouts.
* **Authentication & Authorization**
    * **JWT-Based Authentication:**
        * Tokens are signed with secret keys, also added middleware to verify access token in backend
        * Secure Local Storage management.
    * **Role-Based Access Control:**
        * Different access levels for admins, managers, and customers.
* **Security Features**
    * **Input Validation:**
        * Validate all incoming requests using JOI and Mongoose schema validation.
        * Prevent malicious input, such as SQL injections or invalid JSON payloads.
    * **Data Sanitization:**
        * Use DOMPurify on the backend to clean rich text inputs from users.
        * Strip harmful scripts from long descriptions, comments, and form submissions.
    * **Rate Limiting:**
        * Apply rate limits on sensitive endpoints like login and signup using express-rate-limit.
        * Prevent brute force attacks by limiting requests from the same IP.
    * **CORS Configuration:**
        * Strict CORS policies to allow only whitelisted origins.
        * Prevent unauthorized access from external domains.
    * **Helmet:**
        * Use helmet middleware for enhanced HTTP header security.
    * **Password Hashing:**
        * Passwords hashed using bcrypt before storage in the database.
        * Secure user authentication.
* **Error Handling**
    * Centralized error handling middleware for consistent API responses.
* **Third-Party Integrations**
    * Payment gateways for secure transactions (Stripe, PayPal).
    * Cloudinary for image storage and optimization.
* **Deployment-Ready**
    * Environment-based configuration for development and production.
    * Deployed on Render or similar hosting platforms with automatic scaling.

### 🚀 Future Enhancements
- Add real-time chat support for customers.
- Implement advanced analytics for admin insights.
- Integrate AI-powered product recommendations.
- Use Bun instead of Node.js
- Android app using capacitor

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shadowofleaf96/GreenVille-Ecommerce_Final_Project.git
   ```

2. Change into the project directory:

   ```bash
   cd GreenVille
   ```

3. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

4. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

5. Create a `.env` files in the project root and configure your environment variables:

   ```env client
    VITE_BACKEND_URL = your backend url
    VITE_PAYPAL_CLIENT_ID = Paypal client id
    VITE_PAYPAL_SECRET_KEY = Paypal Secret key
    VITE_STRIPE_PUBLISHABLE_KEY = Stripe publishable key
    VITE_GOOGLE_API_KEY = google api key
    VITE_GOOGLE_CLIENT_ID = google client id
    VITE_CAPTCHA_SITE_KEY= captcha site key
   ```

      ```env server
    EXPIRATIONDATE = token expiration date
    MONGOOSE = mongodb url
    PORT = server port
    REFRESHSECRETLEY = refresh token secret code
    SECRETKEY = access token secret code
    STRIPE_PRIVATE_KEY = stripe private key
    STRIPE_PUBLIC_KEY = stripe public key
    GOOGLE_CLIENT_ID = google client id for login
    FRONTEND_URL = frontend url (localhost:5173 for local)
    BACKEND_URL = backend url (localhost:3000 for local)
    EMAIL_HOST= stmp host           
    EMAIL_PORT=587 or 465
    EMAIL_USER= stmp username
    EMAIL_PASS= stmp password
    EMAIL_FROM="GreenVille <contact email>"
    CLOUDINARY_CLOUD_NAME= cloudinary cloud name
    CLOUDINARY_API_KEY= cloudinary api key 
    CLOUDINARY_API_SECRET= cloudinary api secret
    CAPTCHA_SECRET_KEY= cloudinary api secret key
   ```

6. Start the development server:

   ```bash
   cd client
   npm run dev
   open another terminal window
   cd server
   npx nodemon
   ```

## Contributing

We welcome contributions from the community. If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

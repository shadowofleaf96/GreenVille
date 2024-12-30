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
- [Usage](#usage)
- [Contributing](#contributing)

## Features

### 🛒 Frontoffice (Customer-Facing Features)

- **Responsive Design:** Fully responsive user interface optimized for desktop and mobile.
- **Global Image Optimization:** 
  - All images (products, banners, logos, etc.) are served from **Cloudinary** for optimized performance. Cloudinary automatically handles image resizing, format conversion, and compression to ensure fast load times across all pages.
  - Optimized images are applied across the **Product Listings**, **Product Details**, **About Page**, **Contact Page**, etc.

- **Global SEO Optimization using Helmet:**
  - **react-helmet** is used across all pages (Product Listings, Product Details, Contact, About, etc.) to set dynamic metadata such as titles, descriptions for SEO purposes.
  - **SEO Title Tags and Meta Descriptions** are automatically updated based on the page content (e.g., Product Name, Categories).

- **Product Listings:**
  - Browse products by categories and subcategory.
  - Advanced filtering options (price, option).
  
- **Product Details Page:**
  - Detailed product descriptions (short description and product description), Translated title, Rating.
  - Add to cart or buy immediately.
  - Product Commentary with account name and comment.
  - Real-time stock availability.

- **Shopping Cart:**
  - Add/remove items.
  - Dynamic cart updates with price calculation.
  - **Redux Integration:** Cart information is saved and managed using Redux, ensuring that cart state persists across page reloads and provides a seamless user experience.

- **Checkout System:**
  - Secure order placement.
  - Option to save shipping address to be used later.
  - **Coupon Support:** Apply discount coupons during checkout.
  - Integration with payment gateways (Cash on Delivery, PayPal, Stripe).

- **User Authentication:**
  - Register, log in, and manage profiles (edit customer info, edit shipping address).
  - Password reset functionality.
  - Google Login integration for quick authentication.
  - **reCAPTCHA v3 Integration:** Added to login and register forms to prevent bot attacks.

- **Order Tracking:**
  - View order history, detailed information, and status updates.
  - **Review and Rating:** Submit reviews and rate products for completed orders.

- **Search Functionality:**
  - Search for products by name directly from the navigation bar.

- **Contact Page:**
  - Contact form for inquiries with validation.
  - Embedded Google Maps showing store location(s).
  - Company information (address, phone, email, etc.).

- **About Page:**
  - Dedicated page to describe the company’s mission, vision, and history.

- **Multi-Language Support:**
  - Languages supported: English (EN), French (FR), and Arabic (AR).
  - Implemented using **i18n** for seamless language switching.

---

### 🛠 Admin Panel Features

- **Dashboard:**
  - Overview of **sales**, **orders**, **customers**, **revenues from the sales** and New Orders performance metrics.

- **Product Management:**
  - Add, edit, and delete products.
  - Set product name, short description, and long description in a 3 languages(en, fr, ar) for product.
  - Manage **product categories** and **subcategories**.
  - Upload and optimize product images with **Cloudinary**.
  - Set sku, product price, stock levels, and option and status.

- **Order Management:**
  - View all orders with detailed information (products, quantities, shipping addresses).
  - **Delete order**
  - **Update order statuses** (e.g., Not Shipped, Shipped, Delivered, In Transit).
  - **Update order details** (customer infos, order details, order items).
  - Cancel orders or modify customer orders.
  - View order history for each customer.

- **User Management:**
  - View, add, and manage customer accounts.
  - Assign admin roles to specific users for role-based access control.
  - Edit user details (e.g., name, email, address).
  - Track user activity (last login, order history, etc.).

- **Customer Management:**
  - View customer informations.
  - Edit Customer infos(customer details, shipping address details).
  - Delete customer account

- **Category Management:**
  - Create, edit, and delete product categories.
  - Set name in 3 languages(en, fr, ar) and status.
  
- **Subcategory Management:**
  - Manage subcategories under product categories.
  - Link products to appropriate subcategories.
  - Control sorting and filtering of products by subcategory.

- **Coupon Management:**
  - Create, edit, and delete discount coupons.
  - Define coupon properties such as **Discount percentage**, **Expiration Date**, and **usage limit** and status.
  
- **Payment List Management:**
  - Create, edit, and delete payments.
  - View a list of payment methods used by customers (Stripe, PayPal, Cash on Delivery).

- **Review Management:**
  - View and manage **product reviews** submitted by customers.
  - Moderate and approve/reject reviews based on content.
  - Respond to customer reviews for better engagement.
  - View review ratings and reports to improve product quality and customer satisfaction.

- **Inventory Management:**
  - Track inventory levels across multiple locations.
  - Sync inventory with external sources (e.g., Shopify API, or other e-commerce platforms).
  - **Automated Stock Updates**: Automatic inventory updates when products are sold or restocked.
  - Set reorder alerts when stock levels are low.
  - Manage **inventory locations** (e.g., warehouses, stores).
  
- **Contact Management:**
  - View, manage, and respond to customer **contact form submissions**.
  - Manage **customer support emails**, view their inquiry details, and respond directly from the admin panel.
  - View **contact message history** (email, messages from form submissions).

---

### 🖧 Backend Features
- **RESTful API:**
  - Built with Express.js for efficient communication between frontend and backend.
  - Secure endpoints for admin and customer operations.
- **Database:**
  - MongoDB database with models for users, products, orders, and inventory.
- **Authentication & Authorization:**
  - JWT-based authentication for secure user sessions.
  - Role-based access control for admin and customer operations(Admin and Manager).
- **Data Validation:**
  - Schema validation using Mongoose and JOI to ensure clean data.
- **Error Handling:**
  - Global error handling middleware for API stability.
- **Third-Party Integrations:**
  - Payment gateway for secure transactions.
  - Shopify API for inventory synchronization.
- **Deployment-Ready:**
  - Environment configuration for production and development modes.
  - Deployed using platforms like Vercel (frontend) and Heroku (backend).

---

### 🚀 Future Enhancements
- Add real-time chat support for customers.
- Implement advanced analytics for admin insights.
- Integrate AI-powered product recommendations.

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

5. Create a `.env` file in the project root and configure your environment variables:

   ```env
   VITE_PORT = 3000
   VITE_SECRETKEY = your token secret key
   VITE_REFRESHSECRETLEY = your refresh token secret token
   VITE_STMPHOST = Mailtrap host
   VITE_STMPUSER = Mailtrap username
   VITE_URLFRONTEND = localhost:5173 
   VITE_URLBACKEND = localhost:3000
   VITE_STMPASS = Mailtrap password
   VITE_SENDER = your email
   VITE_EXPIRATIONDATE = 120000 (you can change this)
   VITE_MONGOOSE = MongoDB atlas db link
   ```

6. Start the development server:

   ```bash
   cd client
   npm run dev
   open another terminal window
   cd server
   npx nodemon
   ```
   
## Usage
Client:
1. **Create an Account**: Register for a new account on the GreenVille website.
2. **Explore Products**: Browse through the available products and categories.
3. **Add to Cart**: Add desired products to your shopping cart.
4. **Proceed to Checkout**: Complete the purchase by providing necessary details.
5. **Manage Orders**: View and manage your order history.
Admin:
1. **Analytics**: See sales and revenues data through dashboard.
2. **Add Products**: Add Product from the admin menu.
3. **Add Users**: Add admins or managers.
4. **Add Categories and Subcategories**: Add Categories and Subcategories.
5. **Edit and remove existant Infos**: .

## Contributing

We welcome contributions from the community. If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

# GreenVille Ecommerce Shop Project

![GreenVille Logo](https://github.com/shadowofleaf96/Ecommerce-Final-Project/blob/main/client/src/assets/logo.webp?raw=true)

Welcome to GreenVille, an open-source MERN (MongoDB, Express.js, React.js, Node.js) stack ecommerce shop project. GreenVille is designed to provide a foundation for building a robust and scalable online bio Organic store. Whether you're a developer looking to learn MERN stack or an entrepreneur planning to kickstart your ecommerce venture, GreenVille is a great starting point.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **User Authentication**: Secure user authentication and authorization. (Completed)
- **Product Management**: Easily manage products, categories, subcategories. (Completed)
- **Shopping Cart**: Intuitive shopping cart functionality for users. (Completed, but need some improvements)
- **Payment Integration**: Seamless integration with popular payment gateways. (In Progress)
- **Order Management**: Track and manage customer orders efficiently. (In Progress)
- **Responsive Design**: Mobile-friendly and responsive UI for a great user experience. (In Progress)

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

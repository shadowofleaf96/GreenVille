const customers = require("../models/Customer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

function verifyToken(token, callback) {
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      callback(null);
    } else {
      callback(decoded);
    }
  });
}

const customersController = {  
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const customer = await customers.findOne({ username, password });

      if (customer && customer.active) {
        // Generate an access token with a short expiration time (e.g., 1 hour)
        const accessToken = jwt.sign({ sub: customer._id }, process.env.SECRET_KEY, {
          expiresIn: '1h',
        });

        // Generate a refresh token with a longer expiration time (e.g., 7 days)
        const refreshToken = jwt.sign({ sub: customer._id }, process.env.REFRESH_SECRET_KEY, {
          expiresIn: '7d',
        });

        // Store the refresh token on the server (e.g., in a database)
        // You should have a mechanism to associate refresh tokens with users

        // Set both the access token and refresh token as cookies (httpOnly and secure are recommended)
        res.cookie('access_token', accessToken, { httpOnly: true, secure: false });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: false });

        res.json({
          message: 'Login success',
          accessToken, // Return the access token
          refreshToken, // Return the refresh token
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials or inactive account' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async createCustomer(req, res) {  //Create a new customer account
    const { first_name, last_name, email, password } = req.body;

    try {
      const existingCustomer = await customers.findOne({ email });

      if (existingCustomer) {
        return res.status(400).json({ error: 'Customer with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newCustomer = new customers({
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });

      await newCustomer.save();

      res.status(201).json({ status: 200, message: 'Customer created successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Bad field type' });
    }
  },

  async getCustomerProfile(req, res) {  //Get the customer's profile
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    verifyToken(token, async (decoded) => {
      if (decoded) {
        const customer = await customers.find({ _id: decoded.sub });
        res.json(customer);
      } else {
        res.status(401).json({ message: 'Invalid token' });
      }
    });
  },

  async getAllCustomers(req, res) {  //Get all the customers list & Search for a customer
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || "";
    const sort = req.query.sort || 'DESC';

    const perPage = 10;
    const skipCount = (page - 1) * perPage;

    try {
      let queryBuilder = customers.find();

      if (query) {
        queryBuilder = queryBuilder.where('first_name', new RegExp(query, 'i'));
      }

      if (sort.toUpperCase() === 'DESC') {
        queryBuilder = queryBuilder.sort({ first_name: -1 });
      } else {
        queryBuilder = queryBuilder.sort({ first_name: 1 });
      }

      const customerList = await queryBuilder
        .skip(skipCount)
        .limit(perPage)
        .exec();

      const formattedCustomers = customerList.map((customer) => ({
        _id: customer._id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
      }));

      res.status(200).json({
        status: 200,
        data: formattedCustomers,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getCustomerById(req, res) {  //Get a customer by ID
    const customerId = req.params.id;

    try {
      const customeers = await customers.find();

      const matchingCustomer = customeers.find((element) => {
        return element.id === customerId;
      });

      if (!matchingCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      } else {
        res.json(matchingCustomer);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async validateCustomer(req, res) {  //Validate the customer's account or email
    const _id = req.params.id;
  
    try {
      const matchingCustomer = await customers.findById(_id);
      if (!matchingCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      if (matchingCustomer?.validated) {
        return res.status(400).json({ message: 'Account is already validated' });
      }
  
      matchingCustomer.validated = true;
      await matchingCustomer.save();
  
      // Send an email to the customer
      const transporter = nodemailer.createTransport({
        // Set up your email configuration here
      });
      const mailOptions = {
        to: matchingCustomer.email,
        subject: 'Account Validation Successful',
        text: 'Your account has been successfully validated!',
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email sending error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      // Respond to the client
      res.status(200).json({ message: 'Customer account validated successfully' });
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    },

  async updateCustomer(req, res) {  //Update the customer's data
    const customerId = req.params.id;
    const { first_name, last_name, email, active } = req.body;

    try {
      const customer = await customers.findById(customerId);

      if (!customer) {
        return res.status(404).json({ message: 'Invalid customer id' });
      }

      if (first_name) {
        customer.first_name = first_name;
      }

      if (last_name) {
        customer.last_name = last_name;
      }
      if (email) {
        customer.email = email;
      }
      if (active) {
        customer.active = active;
      }

      await customer.save();

      res.status(200).json({ message: 'Customer information updated', customer });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteCustomer(req, res) {   //Delete the customer's account
    const customerId = req.params.id;

    try {
      const customer = await customers.findOneAndRemove({ id: customerId });

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      return res.status(200).json({ message: 'Account deleted' });
    } catch (error) {
      console.error('Deletion error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

 
  async logout(req, res) {         //logout
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  },
};

module.exports = customersController;
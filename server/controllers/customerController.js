// Shadow Of Leaf was Here

const { Customer } = require("../models/Customer");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { createTransport } = require("nodemailer");
const { log } = require("console");
const secretKey = process.env.SECRETKEY;
const secretRefreshKey = process.env.REFRESHSECRETLEY;
const expiration = process.env.EXPIRATIONDATE;

function verifyToken(token, callback) {
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      callback(err);
    } else {
      callback(decoded);
    }
  });
}

const CustomerController = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const customer = await Customer.findOne({ email });

      if (customer && customer.active === true) {
        const isPasswordValid = await bcrypt.compare(
          password,
          customer.password
        );

        if (isPasswordValid) {
          // Generate JWT token
          const payload = {
            id: customer._id,
          };
          const accessToken = jwt.sign(payload, secretKey, {
            expiresIn: "8h",
          });

          res.cookie("customer_access_token", accessToken, {
            httpOnly: false,
            secure: false,
          });

          const refreshTokenPayload = {
            id: customer._id,
          };

          const refreshToken = jwt.sign(refreshTokenPayload, secretRefreshKey, {
            expiresIn: "7d",
          });

          res.cookie("customer_refresh_token", refreshToken, {
            httpOnly: false,
            secure: false,
          });

          return res.status(200).json({
            message: "Login success",
            access_token: accessToken,
            token_type: "Bearer",
            expires_in: "8h",
            refresh_token: refreshToken,
            customer: customer,
          });
        } else {
          res
            .status(401)
            .json({ message: "Invalid credentials or inactive account" });
        }
      } else {
        res
          .status(401)
          .json({ message: "Invalid credentials or inactive account" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async createCustomer(req, res) {
    const customer_image = req.file;
    let fixed_customer_image;

    if (customer_image) {
      fixed_customer_image = customer_image.path.replace(/public\\/g, "");
    } else {
      fixed_customer_image = `images/image_placeholder.png`;
    }
    const { first_name, last_name, email, password } = req.body;

    try {
      const existingCustomer = await Customer.findOne({ email });

      if (existingCustomer) {
        return res
          .status(400)
          .json({ error: "Customer with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newCustomer = new Customer({
        customer_image: fixed_customer_image, // Store the file path in the database
        first_name,
        last_name,
        email,
        password: hashedPassword,
        creation_date: Date.now(),
        active: true,
      });

      await newCustomer.save();

      res.status(200).json({
        message: "Customer created successfully",
        data: newCustomer,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Bad field type" });
    }
  },

  async getCustomerProfile(req, res) {
    //Get the customer's profile
    const token = req.cookies.customer_access_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    verifyToken(token, async (decoded) => {
      if (decoded) {
        const customer = await Customer.find({ _id: decoded.id });
        res.json(customer);
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    });
  },

  async getAllCustomers(req, res) {
    //Get all the Customer list & Search for a customer
    const page = parseInt(req.query.page);
    const query = req.query.query || "";
    const sort = req.query.sort || "DESC";

    const perPage = 10;
    const skipCount = (page - 1) * perPage;

    if (page) {
      try {
        let queryBuilder = Customer.find();

        if (query) {
          queryBuilder = queryBuilder.where(
            "first_name",
            new RegExp(query, "i")
          );
        }

        if (sort.toUpperCase() === "DESC") {
          queryBuilder = queryBuilder.sort({ first_name: -1 });
        } else {
          queryBuilder = queryBuilder.sort({ first_name: 1 });
        }

        const customerList = await queryBuilder
          .skip(skipCount)
          .limit(perPage)
          .exec();

        const formattedCustomer = customerList.map((customer) => ({
          _id: customer._id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
        }));

        res.status(200).json({
          data: formattedCustomer,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      try {
        let queryBuilder = Customer.find();

        if (query) {
          queryBuilder = queryBuilder.where(
            "first_name",
            new RegExp(query, "i")
          );
        }

        if (sort.toUpperCase() === "DESC") {
          queryBuilder = queryBuilder.sort({ first_name: -1 });
        } else {
          queryBuilder = queryBuilder.sort({ first_name: 1 });
        }

        const customerList = await queryBuilder.exec();

        res.status(200).json({
          data: customerList,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  },
  async getCustomerById(req, res) {
    //Get a customer by ID
    const customerId = req.params.id;
    try {
      const matchingCustomer = await Customer.findById(customerId);

      if (!matchingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      } else {
        res.json(matchingCustomer);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async validateCustomer(req, res) {
    //Validate the customer's account or email
    const _id = req.params.id;

    try {
      const matchingCustomer = await Customer.findById(_id);
      if (!matchingCustomer || matchingCustomer.active === false) {
        return res
          .status(404)
          .json({ message: "Customer not found or not active" });
      }

      if (matchingCustomer?.valid_account) {
        return res
          .status(400)
          .json({ message: "Account is already validated" });
      }

      matchingCustomer.valid_account = true;
      await matchingCustomer.save();

      // Send an email to the customer
      const transporter = createTransport({
        host: process.env.STMPHOST,
        port: 2525,
        secure: false,
        auth: {
          user: process.env.STMPUSER,
          pass: process.env.STMPASS,
        },
      });
      const mailOptions = {
        to: matchingCustomer.email,
        subject: "Account Validation Successful",
        text: "Your account has been successfully validated!",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email sending error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      // Respond to the client
      res
        .status(200)
        .json({ message: "Customer account validated successfully" });
    } catch (error) {
      console.error("Validation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async updateCustomer(req, res) {
    const customer_image = req.file;
    let fixed_customer_image;
    const customerId = req.params.id;
    const { first_name, last_name, email, password, active } = req.body;

    try {
      const customer = await Customer.findById(customerId);

      if (!customer) {
        return res.status(404).json({ message: "Invalid customer id" });
      }

      if (customer_image) {
        fixed_customer_image = customer_image.path.replace(/public\\/g, "");
      } else {
        fixed_customer_image = customer.customer_image;
      }

      if (customer_image) {
        customer.customer_image = fixed_customer_image;
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

      const hashedPassword = await bcrypt.hash(password, 10);

      if (password) {
        customer.password = hashedPassword;
      }

      if (active) {
        customer.active = active;
      }

      await customer.save();

      res.status(200).json({
        message: "Account updated successfully",
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteCustomer(req, res) {
    const customerId = req.params.id;

    try {
      const customer = await Customer.findOneAndRemove({ _id: customerId });

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Deletion error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async logout(req, res) {
    if (req.cookies["customer_access_token"]) {
      res.clearCookie("customer_access_token").status(200);
      res.clearCookie("customer_refresh_token").status(200).json({
        message: "Logout successful",
      });
    } else {
      res.status(401).json({
        error: "Invalid jwt",
      });
    }
  },
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Find the user by email
      const customer = await Customer.findOne({ email });

      // If user not found, return an error
      if (!customer) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate a unique token for password reset
      const resetToken = crypto.randomBytes(20).toString("hex");

      // Set the token and expiration time in the user's document
      customer.resetPasswordToken = resetToken;
      customer.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

      // Save the user with the updated token information
      await customer.save();

      // Send an email with the reset link
      const transporter = createTransport({
        host: process.env.STMPHOST,
        port: 2525,
        secure: false,
        auth: {
          user: process.env.STMPUSER,
          pass: process.env.STMPASS,
        },
      });

      const mailOptions = {
        from: " process.env.SENDER",
        to: customer.email,
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${process.env.URL}/reset-password/${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      console.log(newPassword);

      const customer = await Customer.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!customer) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      customer.password = hashedNewPassword;
      customer.resetPasswordToken = undefined;
      customer.resetPasswordExpires = undefined;

      await customer.save();

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = CustomerController;

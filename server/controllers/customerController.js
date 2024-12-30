// Shadow Of Leaf was Here

const { Customer } = require("../models/Customer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const { log } = require("console");
const transporter = require("../middleware/mailMiddleware");
const secretKey = process.env.SECRETKEY;
const secretRefreshKey = process.env.REFRESHSECRETLEY;
const captchaSecretKey = process.env.CAPTCHA_SECRET_KEY;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyReCaptcha = async (recaptchaToken) => {
  const url = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await axios.post(url, null, {
      params: {
        secret: captchaSecretKey,
        response: recaptchaToken,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
};

const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA token is missing" });
  }

  const isVerified = await verifyReCaptcha(recaptchaToken);
  if (!isVerified) {
    return res.status(400).json({ message: "reCAPTCHA verification failed" });
  }

  try {
    const customer = await Customer.findOne({ email });

    if (customer && customer.status === true) {
      const isPasswordValid = await bcrypt.compare(password, customer.password);

      if (isPasswordValid) {
        const payload = { id: customer._id, role: customer.role };
        const accessToken = jwt.sign(payload, secretKey, {
          expiresIn: "3d",
        });

        const refreshTokenPayload = { id: customer._id, role: customer.role };
        const refreshToken = jwt.sign(refreshTokenPayload, secretRefreshKey, {
          expiresIn: "7d",
        });

        return res.status(200).json({
          message: "Login success",
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: "3d",
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
};

const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let customer = await Customer.findOne({ email });

    if (!customer) {
      const cleanUrl = `${
        process.env.FRONTEND_LOCAL_URL
      }set-password?email=${encodeURIComponent(
        email
      )}&name=${encodeURIComponent(name)}&picture=${encodeURIComponent(
        picture
      )}`;

      return res.json({ cleanUrl: cleanUrl });
    }

    const tokenPayload = { id: customer._id, role: customer.role };

    const accessToken = jwt.sign(tokenPayload, secretKey, {
      expiresIn: "3d",
    });

    const refreshToken = jwt.sign(tokenPayload, secretRefreshKey, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Google login success",
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: "3d",
      refresh_token: refreshToken,
      customer: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Google login failed" });
  }
};

function completeRegistrationEmailTemplate(name) {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/shadowofleaf96/GreenVille/refs/heads/dev/client/public/assets/logo-email.png" alt="GreenVille Logo" style="max-width: 150px; display: block; margin: 0 auto;" />
          </div>
          <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
          <p>We’re excited to let you know that your registration is now complete.</p>
          <p>You can log in using your credentials to start exploring our services.</p>
          <p style="color: #555;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br/>GreenVille</p>
        </div>
      </body>
    </html>
  `;
}

const completeRegistration = async (req, res) => {
  const { email, name, password } = req.body;
  const [first_name, last_name] = name.split(" ");
  const picture = req.file;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ error: "Customer with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      customer_image: typeof picture === "string" ? picture : picture.path,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      creation_date: Date.now(),
      status: true,
    });

    await newCustomer.save();

    const emailTemplate = completeRegistrationEmailTemplate(
      newCustomer.first_name
    );

    const mailOptions = {
      to: newCustomer.email,
      subject: "Welcome to GreenVille",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
      } else {
        console.log("Welcome email sent:", info.response);
      }
    });

    res.status(200).json({
      message: "Customer registered successfully, now you can login",
      data: newCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error in customer registration", error });
  }
};

function validationEmailTemplate(name, validationLink) {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/shadowofleaf96/GreenVille/refs/heads/dev/client/public/assets/logo-email.png" alt="GreenVille Logo" style="max-width: 150px; display: block; margin: 0 auto;" />
          </div>
          <h2 style="color: #4CAF50;">Hello ${name},</h2>
          <p>Thank you for creating an account with us! To complete your registration, please confirm your email address by clicking the link below:</p>
          <p><a href="${validationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 4px;">Validate Your Account</a></p>
          <p style="color: #555;">This validation link is valid for 24 hours. If you did not request this, please disregard this email.</p>
          <p>Best regards,<br/>GreenVille</p>
        </div>
      </body>
    </html>
  `;
}

const createCustomer = async (req, res) => {
  const customer_image = req.file;

  const { first_name, last_name, email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA token is missing" });
  }

  const isVerified = await verifyReCaptcha(recaptchaToken);
  if (!isVerified) {
    return res.status(400).json({ message: "reCAPTCHA verification failed" });
  }

  try {
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res
        .status(400)
        .json({ error: "Customer with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const validationToken = crypto.randomBytes(32).toString("hex");

    const newCustomer = new Customer({
      customer_image:
        typeof customer_image === "string"
          ? customer_image
          : customer_image?.path || null,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      creation_date: Date.now(),
      status: false,
      validation_token: validationToken,
    });

    await newCustomer.save();

    const validationLink = `${process.env.BACKEND_LOCAL_URL}v1/customers/validate/${newCustomer._id}/${validationToken}`;
    const emailTemplate = validationEmailTemplate(
      newCustomer.first_name,
      validationLink
    );

    const mailOptions = {
      to: newCustomer.email,
      subject: "GreenVille - Activate your account",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
      } else {
        console.log("Validation email sent:", info.response);
      }
    });

    res.status(200).json({
      message:
        "Customer created successfully. Please check your email to validate your account.",
      redirectUrl: `${process.env.FRONTEND_LOCAL_URL}check-email`,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json("Error creating Customer Account" + error);
  }
};

const getAllCustomers = async (req, res) => {
  const page = parseInt(req.query.page);
  const query = req.query.query || "";
  const sort = req.query.sort || "DESC";

  const perPage = 10;
  const skipCount = (page - 1) * perPage;

  if (page) {
    try {
      let queryBuilder = Customer.find();

      if (query) {
        queryBuilder = queryBuilder.where("first_name", new RegExp(query, "i"));
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
        queryBuilder = queryBuilder.where("first_name", new RegExp(query, "i"));
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
};

const getCustomerProfile = async (req, res) => {
  const { _id } = req.user;
  try {
    const customer = await Customer.findById(_id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    delete customer.password;
    res.json(customer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getCustomerById = async (req, res) => {
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
};

function successValidationEmailTemplate(name) {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/shadowofleaf96/GreenVille/refs/heads/dev/client/public/assets/logo-email.png" alt="GreenVille Logo" style="max-width: 150px; display: block; margin: 0 auto;" />
          </div>
          <h2 style="color: #4CAF50;">Hello ${name},</h2>
          <p>Congratulations! Your account has been successfully validated.</p>
          <p style="color: #555;">You can now log in and start exploring our services.</p>
          <p>Best regards,<br/>GreenVille</p>
        </div>
      </body>
    </html>
  `;
}

const validateCustomer = async (req, res) => {
  const { id, token } = req.params;

  try {
    const matchingCustomer = await Customer.findById(id);

    if (!matchingCustomer || matchingCustomer.validation_token !== token) {
      return res
        .status(404)
        .send(
          "<html><body><h2>Invalid token or customer not found</h2></body></html>"
        );
    }

    if (matchingCustomer.status) {
      return res
        .status(400)
        .send(
          "<html><body><h2>Account is already validated</h2></body></html>"
        );
    }

    matchingCustomer.status = true;
    matchingCustomer.validation_token = null;
    await matchingCustomer.save();

    const emailTemplate = successValidationEmailTemplate(
      matchingCustomer.first_name
    );

    const mailOptions = {
      to: matchingCustomer.email,
      subject: "GreenVille - Account Validation",
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.redirect(
      `${process.env.FRONTEND_LOCAL_URL}login?validationSuccess=true`
    );
  } catch (error) {
    console.error("Validation error:", error);
    res
      .status(500)
      .send("<html><body><h2>Internal server error</h2></body></html>");
  }
};

const updateCustomer = async (req, res) => {
  const customer_image = req.file;
  const customerId = req.params.id;
  const { first_name, last_name, email, password, status, shipping_address } =
    req.body;

  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Invalid customer id" });
    }

    if (customer_image) {
      customer.customer_image =
        typeof customer_image === "string"
          ? customer_image
          : customer_image.path;
    }

    if (first_name) {
      customer.first_name = first_name;
    }

    if (last_name) {
      customer.last_name = last_name;
    }

    if (email && email !== customer.email) {
      const existingEmail = await Customer.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      customer.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      customer.password = hashedPassword;
    }

    if (shipping_address) {
      customer.shipping_address = shipping_address;
    }

    if (status) {
      customer.status = status;
    }

    await customer.validate();
    await customer.save();

    res.status(200).json({
      message: "Account updated successfully",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error " + error,
    });
    console.log(error);
  }
};

const deleteCustomer = async (req, res) => {
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
};

function passwordResetEmailTemplate(name, resetToken) {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="https://raw.githubusercontent.com/shadowofleaf96/GreenVille/refs/heads/dev/client/public/assets/logo-email.png" alt="GreenVille Logo" style="max-width: 150px; display: block; margin: 0 auto;" />
          </div>
          <h2 style="color: #4CAF50;">Hello ${name},</h2>
          <p>You requested a password reset for your account.</p>
          <p style="color: #555;">Please click on the link below to reset your password:</p>
          <p>
            <a href="${process.env.FRONTEND_LOCAL_URL}reset-password/${resetToken}" style="text-decoration: none; color: #fff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
          </p>
          <p style="color: #555;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br/>GreenVille</p>
        </div>
      </body>
    </html>
  `;
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    customer.resetPasswordToken = resetToken;
    customer.resetPasswordExpires = Date.now() + 3600000;

    await customer.save();

    const mailOptions = {
      to: customer.email,
      subject: "GreenVille - Password Reset",
      html: passwordResetEmailTemplate(customer.first_name, resetToken),
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
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

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
};

module.exports = {
  login,
  googleLogin,
  resetPassword,
  forgotPassword,
  deleteCustomer,
  updateCustomer,
  validateCustomer,
  getCustomerById,
  getCustomerProfile,
  getAllCustomers,
  createCustomer,
  completeRegistration,
};

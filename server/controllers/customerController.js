import { Customer } from "../models/Customer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import transporter from "../middleware/mailMiddleware.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { sendSecurityAlertEmail } from "../utils/emailUtility.js";
import { createDashboardNotification } from "../utils/dashboardNotificationUtility.js";

const secretKey = process.env.SECRETKEY;
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

export const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA token is missing" });
  }

  const isVerified = await verifyReCaptcha(recaptchaToken);
  if (!isVerified) {
    return res.status(400).json({ message: "reCAPTCHA verification failed" });
  }

  const customer = await Customer.findOne({ email });

  if (customer && customer.status === true) {
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (isPasswordValid) {
      const payload = { id: customer._id, role: customer.role };
      const accessToken = jwt.sign(payload, secretKey, {
        expiresIn: "3d",
      });

      return res.status(200).json({
        message: "Login success",
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: "3d",
        customer: customer,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid credentials or inactive account" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Invalid credentials or inactive account" });
  }
};

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  let customer = await Customer.findOne({ email });

  if (!customer) {
    const cleanUrl = `${
      process.env.FRONTEND_URL
    }/set-password?email=${encodeURIComponent(
      email,
    )}&name=${encodeURIComponent(name)}&picture=${encodeURIComponent(picture)}`;

    return res.status(200).json({ cleanUrl: cleanUrl });
  }

  const tokenPayload = { id: customer._id, role: customer.role };

  const accessToken = jwt.sign(tokenPayload, secretKey, {
    expiresIn: "3d",
  });

  res.status(200).json({
    message: "Google login success",
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: "3d",
    customer: customer,
  });
};

function completeRegistrationEmailTemplate(
  name,
  siteLogo,
  siteTitle,
  primaryColor,
) {
  return `
    <html>
      <body style="background-color: #f4f4f4; padding: 20px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; border: 1px solid #eee;">
          <div style="margin-bottom: 20px;">
            ${
              siteLogo
                ? `<img src="${siteLogo}" alt="${siteTitle}" style="max-width: 150px; display: block; margin: 0 auto;" />`
                : `<h1 style="color: ${primaryColor}; margin: 0;">${siteTitle}</h1>`
            }
          </div>
          <h2 style="color: ${primaryColor};">Welcome, ${name}!</h2>
          <p>We’re excited to let you know that your registration is now complete.</p>
          <p>You can log in using your credentials to start exploring our services.</p>
          <p style="color: #555;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br/>${siteTitle}</p>
        </div>
      </body>
    </html>
  `;
}

export const completeRegistration = async (req, res) => {
  const { email, name, password } = req.body;
  const [first_name, last_name] = name.split(" ");
  const picture = req.file;

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

  const settings = await SiteSettings.findOne();
  const siteLogo = settings?.logo_url;
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#4CAF50";

  const emailTemplate = completeRegistrationEmailTemplate(
    newCustomer.first_name,
    siteLogo,
    siteTitle,
    primaryColor,
  );

  const mailOptions = {
    to: newCustomer.email,
    from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
    subject: `Welcome to ${siteTitle}`,
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
  }

  // Generate Token
  const payload = { id: newCustomer._id, role: newCustomer.role };
  const accessToken = jwt.sign(payload, secretKey, { expiresIn: "3d" });

  res.status(200).json({
    message: "Customer registered successfully, identifying...",
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: "3d",
    customer: newCustomer,
  });
};

function validationEmailTemplate(
  name,
  validationLink,
  siteLogo,
  siteTitle,
  primaryColor,
) {
  return `
    <html>
      <body style="background-color: #f4f4f4; padding: 20px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; border: 1px solid #eee;">
          <div style="margin-bottom: 20px;">
            ${
              siteLogo
                ? `<img src="${siteLogo}" alt="${siteTitle}" style="max-width: 150px; display: block; margin: 0 auto;" />`
                : `<h1 style="color: ${primaryColor}; margin: 0;">${siteTitle}</h1>`
            }
          </div>
          <h2 style="color: ${primaryColor};">Hello ${name},</h2>
          <p>Thank you for creating an account with us! To complete your registration, please confirm your email address by clicking the link below:</p>
          <p><a href="${validationLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: ${primaryColor}; text-decoration: none; border-radius: 4px;">Validate Your Account</a></p>
          <p style="color: #555;">This validation link is valid for 24 hours. If you did not request this, please disregard this email.</p>
          <p>Best regards,<br/>${siteTitle}</p>
        </div>
      </body>
    </html>
  `;
}

export const createCustomer = async (req, res) => {
  const customer_image = req.file;

  const { first_name, last_name, email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA token is missing" });
  }

  const isVerified = await verifyReCaptcha(recaptchaToken);
  if (!isVerified) {
    return res.status(400).json({ message: "reCAPTCHA verification failed" });
  }

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
    status: true,
    validation_token: validationToken,
  });

  await newCustomer.save();

  // Dashboard Notification for Admin
  try {
    await createDashboardNotification({
      type: "CUSTOMER_REGISTERED",
      title: "New Customer Joined",
      message: `${first_name} ${last_name} has just registered.`,
      metadata: { customer_id: newCustomer._id },
      recipient_role: "admin",
    });
  } catch (notifError) {
    console.error("Failed to create dashboard notification:", notifError);
  }

  const settings = await SiteSettings.findOne();
  const siteLogo = settings?.logo_url;
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#4CAF50";

  const validationLink = `${process.env.BACKEND_URL}v1/customers/validate/${newCustomer._id}/${validationToken}`;
  const emailTemplate = validationEmailTemplate(
    newCustomer.first_name,
    validationLink,
    siteLogo,
    siteTitle,
    primaryColor,
  );

  const mailOptions = {
    to: newCustomer.email,
    from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
    subject: `${siteTitle} - Activate your account`,
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    console.error("Failed to send validation email:", emailError);
  }

  // Auto-Login: Generate token immediately
  const payload = { id: newCustomer._id, role: newCustomer.role };
  const accessToken = jwt.sign(payload, secretKey, { expiresIn: "3d" });

  res.status(200).json({
    message: "Account created successfully.",
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: "3d",
    customer: newCustomer,
  });
};

export const getAllCustomers = async (req, res) => {
  const page = parseInt(req.query.page);
  const query = req.query.query || "";
  const sort = req.query.sort || "DESC";

  const perPage = 10;
  const skipCount = (page - 1) * perPage;

  if (req.user && req.user.role === "vendor") {
    return res.status(200).json({ data: [] });
  }

  let queryBuilder = Customer.find();

  if (query) {
    queryBuilder = queryBuilder.where("first_name", new RegExp(query, "i"));
  }

  if (sort.toUpperCase() === "DESC") {
    queryBuilder = queryBuilder.sort({ first_name: -1 });
  } else {
    queryBuilder = queryBuilder.sort({ first_name: 1 });
  }

  if (page) {
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
  } else {
    const customerList = await queryBuilder.lean().exec();

    res.status(200).json({
      data: customerList,
    });
  }
};

export const getCustomerProfile = async (req, res) => {
  const { _id } = req.user;
  const customer = await Customer.findById(_id).select("-password").lean();
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.status(200).json(customer);
};

export const getCustomerById = async (req, res) => {
  const customerId = req.params.id;
  const matchingCustomer = await Customer.findById(customerId).lean();

  if (!matchingCustomer) {
    return res.status(404).json({ error: "Customer not found" });
  } else {
    res.status(200).json(matchingCustomer);
  }
};

function successValidationEmailTemplate(
  name,
  siteLogo,
  siteTitle,
  primaryColor,
) {
  return `
    <html>
      <body style="background-color: #f4f4f4; padding: 20px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; border: 1px solid #eee;">
          <div style="margin-bottom: 20px;">
            ${
              siteLogo
                ? `<img src="${siteLogo}" alt="${siteTitle}" style="max-width: 150px; display: block; margin: 0 auto;" />`
                : `<h1 style="color: ${primaryColor}; margin: 0;">${siteTitle}</h1>`
            }
          </div>
          <h2 style="color: ${primaryColor};">Hello ${name},</h2>
          <p>Congratulations! Your account has been successfully validated.</p>
          <p style="color: #555;">You can now log in and start exploring our services.</p>
          <p>Best regards,<br/>${siteTitle}</p>
        </div>
      </body>
    </html>
  `;
}

export const validateCustomer = async (req, res) => {
  const { id, token } = req.params;

  try {
    const matchingCustomer = await Customer.findById(id);

    if (!matchingCustomer || matchingCustomer.validation_token !== token) {
      return res
        .status(404)
        .send(
          "<html><body><h2>Invalid token or customer not found</h2></body></html>",
        );
    }

    if (matchingCustomer.status) {
      return res
        .status(400)
        .send(
          "<html><body><h2>Account is already validated</h2></body></html>",
        );
    }

    matchingCustomer.status = true;
    matchingCustomer.validation_token = null;
    await matchingCustomer.save();

    const settings = await SiteSettings.findOne();
    const siteLogo = settings?.logo_url;
    const siteTitle = settings?.website_title?.en || "GreenVille";
    const primaryColor = settings?.theme?.primary_color || "#4CAF50";

    const emailTemplate = successValidationEmailTemplate(
      matchingCustomer.first_name,
      siteLogo,
      siteTitle,
      primaryColor,
    );

    const mailOptions = {
      to: matchingCustomer.email,
      from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
      subject: `${siteTitle} - Account Validation`,
      html: emailTemplate,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send validation success email:", emailError);
    }

    res.redirect(`${process.env.FRONTEND_URL}/login?validationSuccess=true`);
  } catch (error) {
    console.error("Validation error:", error);
    res
      .status(500)
      .send("<html><body><h2>Internal server error</h2></body></html>");
  }
};

export const updateCustomer = async (req, res) => {
  const customer_image = req.file;
  const customerId = req.params.id;
  const { first_name, last_name, email, password, status, shipping_address } =
    req.body;

  const customer = await Customer.findById(customerId);

  if (!customer) {
    return res.status(404).json({ message: "Invalid customer id" });
  }

  let passwordChanged = false;
  let emailChanged = false;

  if (customer_image) {
    customer.customer_image =
      typeof customer_image === "string" ? customer_image : customer_image.path;
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
    emailChanged = true;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    customer.password = hashedPassword;
    passwordChanged = true;
  }

  if (shipping_address) {
    customer.shipping_address = shipping_address;
  }

  if (status !== undefined) {
    customer.status = status;
  }

  await customer.validate();
  await customer.save();

  // Send security alert if critical info changed
  if (passwordChanged) {
    sendSecurityAlertEmail(customer, "password_changed");
  }
  if (emailChanged) {
    sendSecurityAlertEmail(customer, "email_updated");
  }

  res.status(200).json({
    message: "Account updated successfully",
    data: customer,
  });
};

export const deleteCustomer = async (req, res) => {
  const customerId = req.params.id;
  const customer = await Customer.findOneAndDelete({ _id: customerId });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  // Send deletion confirmation email
  sendSecurityAlertEmail(customer, "account_deleted");

  return res.status(200).json({ message: "Account deleted successfully" });
};

function passwordResetEmailTemplate(
  name,
  resetToken,
  siteLogo,
  siteTitle,
  primaryColor,
) {
  return `
    <html>
      <body style="background-color: #f4f4f4; padding: 20px;">
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center; background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; border: 1px solid #eee;">
          <div style="margin-bottom: 20px;">
            ${
              siteLogo
                ? `<img src="${siteLogo}" alt="${siteTitle}" style="max-width: 150px; display: block; margin: 0 auto;" />`
                : `<h1 style="color: ${primaryColor}; margin: 0;">${siteTitle}</h1>`
            }
          </div>
          <h2 style="color: ${primaryColor};">Hello ${name},</h2>
          <p>You requested a password reset for your account.</p>
          <p style="color: #555;">Please click on the link below to reset your password:</p>
          <p>
            <a href="${
              process.env.FRONTEND_URL
            }/reset-password/${resetToken}" style="text-decoration: none; color: #fff; background-color: ${primaryColor}; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
          </p>
          <p style="color: #555;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br/>${siteTitle}</p>
        </div>
      </body>
    </html>
  `;
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const customer = await Customer.findOne({ email });

  if (!customer) {
    return res.status(404).json({ error: "User not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  customer.resetPasswordToken = resetToken;
  customer.resetPasswordExpires = Date.now() + 3600000;

  await customer.save();

  const settings = await SiteSettings.findOne();
  const siteLogo = settings?.logo_url;
  const siteTitle = settings?.website_title?.en || "GreenVille";
  const primaryColor = settings?.theme?.primary_color || "#4CAF50";

  const mailOptions = {
    to: customer.email,
    from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
    subject: `${siteTitle} - Password Reset`,
    html: passwordResetEmailTemplate(
      customer.first_name,
      resetToken,
      siteLogo,
      siteTitle,
      primaryColor,
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    console.error("Failed to send password reset email:", emailError);
  }

  res.status(200).json({ message: "Password reset email sent" });
};

export const resetPassword = async (req, res) => {
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

  // Send security alert
  sendSecurityAlertEmail(customer, "password_reset_success");

  res.status(200).json({ message: "Password reset successfully" });
};

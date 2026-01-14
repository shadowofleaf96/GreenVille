// Shadow Of Leaf was Here

const { User } = require("../models/User");
const Vendor = require("../models/Vendor"); // Import Vendor model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { log } = require("console");
require("dotenv").config();
const crypto = require("crypto");
const transporter = require("../middleware/mailMiddleware");
const secretKey = process.env.SECRETKEY;
const secretRefreshKey = process.env.REFRESHSECRETLEY;
const expiration = process.env.EXPIRATIONDATE;

const createUser = async (req, res) => {
  const user_image = req.file;
  const { role, user_name, first_name, last_name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ user_name }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "User name or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      user_image:
        typeof user_image === "string" ? user_image : user_image?.path,
      role,
      user_name,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      creation_date: Date.now(),
      status: true,
    });

    // If role is vendor, create the Vendor profile
    if (role === "vendor") {
      try {
        await Vendor.create({
          user: newUser._id,
          store_name: `${user_name}'s Store`, // Default store name
          store_description: `Welcome to ${user_name}'s store!`,
          status: "approved", // Auto-approve admin-created vendors
        });
      } catch (vendorError) {
        console.error("Error creating vendor profile:", vendorError);
        // Optional: Delete the user if vendor creation fails to maintain consistency
        // await User.findByIdAndDelete(newUser._id);
        // return res.status(500).json({ message: "Failed to create vendor profile" });

        // For now, just log it. The user exists, but might need manual vendor fixes.
      }
    }

    const mailOptions = {
      from: process.env.SENDER,
      to: newUser.email,
      subject: `Welcome to Our Ecommerce Project`,
      text: `Hello ${newUser.first_name},\n\nWelcome to Our Ecommerce Project! Your account has been successfully created.`,
    };

    transporter.sendMail(mailOptions);

    res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Error creating the user",
    });
  }
};

const getAllUsers = async (req, res, next) => {
  const { page, sort, role } = req.query;
  const perPage = 10;

  const skip = (page - 1) * perPage;

  const sortOrder = sort === "DESC" ? -1 : 1;
  const filter = {};
  if (role) {
    filter.role = role;
  }

  if (page) {
    try {
      const Users = await User.find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ creation_date: sortOrder })
        .lean();
      res.status(200).json({
        status: 200,
        data: Users,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    try {
      const Users = await User.find(filter).lean();
      res.status(200).json({
        status: 200,
        data: Users,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
};

const searchUser = async (req, res, next) => {
  try {
    let { query, page = 1, sort = "DESC" } = req.query;
    const perPage = 10;

    const skip = (page - 1) * perPage;

    const sortOrder = sort === "DESC" ? -1 : 1;

    const searchQuery = {
      $or: [
        { first_name: { $regex: new RegExp(query, "i") } },
        { last_name: { $regex: new RegExp(query, "i") } },
        { user_name: { $regex: new RegExp(query, "i") } },
        { email: { $regex: new RegExp(query, "i") } },
      ],
    };
    query = User.find(searchQuery)
      .skip(skip)
      .limit(perPage)
      .sort({ creation_date: sortOrder })
      .lean();

    const users = await query.exec();

    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getUserDetails = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const matchingUser = await User.findById(userId).lean();

    if (matchingUser) {
      res.status(200).json({
        data: matchingUser,
      });
    } else {
      res.status(404).json({
        message: "No Users found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateUser = async (req, res) => {
  try {
    const user_image = req.file;
    const userId = req.params.id;
    const { role, first_name, last_name, user_name, email, password, status } =
      req.body;
    const invalidFields = [];

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "Invalid user id",
      });
    }

    if (typeof role !== "string") {
      invalidFields.push("role");
    }
    if (typeof first_name !== "string") {
      invalidFields.push("first_name");
    }
    if (typeof last_name !== "string") {
      invalidFields.push("last_name");
    }
    if (typeof user_name !== "string") {
      invalidFields.push("user_name");
    }
    if (typeof email !== "string") {
      invalidFields.push("email");
    }
    if (password && typeof password !== "string") {
      invalidFields.push("password");
    }

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Bad request. The following fields have invalid data types: ${invalidFields.join(
          ", ",
        )}`,
      });
    }

    if (user_image) {
      existingUser.user_image =
        typeof user_image === "string" ? user_image : user_image.path;
    }

    if (role) existingUser.role = role;
    if (first_name) existingUser.first_name = first_name;
    if (last_name) existingUser.last_name = last_name;
    if (user_name) existingUser.user_name = user_name;
    if (email) existingUser.email = email;
    if (status !== undefined) existingUser.status = status;

    if (password) {
      existingUser.password = await bcrypt.hash(password, 10);
    }
    existingUser.last_update = new Date();

    await existingUser.save();

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: existingUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await User.findOneAndDelete({ _id: userId });

    if (!existingUser) {
      res.status(404).json({
        message: "Invalid User id",
      });
    } else {
      res.status(200).json({
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const loginUser = async (req, res, next) => {
  const { user_name, password } = req.body;

  try {
    const user = await User.findOne({ user_name });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user && !user.status) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: "3d",
    });

    // const refreshTokenPayload = {
    //   id: user._id,
    //   role: user.role,
    // };
    // const refreshToken = jwt.sign(refreshTokenPayload, secretRefreshKey, {
    //   expiresIn: "7d",
    // });

    user.last_login = new Date();
    await user.save();

    return res.status(200).json({
      message: "Login success",
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: "3d",
      // refresh_token: refreshToken,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const mailOptions = {
      from: " process.env.SENDER",
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAdminProfile = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserDetails,
  searchUser,
  updateUser,
  getAdminProfile,
  deleteUser,
  loginUser,
  forgotPassword,
  resetPassword,
};

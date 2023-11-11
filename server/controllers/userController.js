// Shadow Of Leaf was Here

const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { createTransport } = require("nodemailer");
const { log } = require("console");
const secretKey = process.env.SECRETKEY;
const secretRefreshKey = process.env.REFRESHSECRETLEY;
const expiration = process.env.EXPIRATIONDATE;

const createUser = async (req, res) => {
  const user_image = req.file;
  // Extract user data from the request body
  const { role, user_name, first_name, last_name, email, password } = req.body;
  

  // Check if the user already exists based on user_name or email
  const existingUser = await User.findOne({
    $or: [{ user_name }, { email }],
  });

  if (existingUser) {
    return res.status(400).json({
      status: 400,
      message: "Username or email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user using the create() method
  User.create({
    user_image: user_image.path, // Store the file path in the database
    role,
    user_name,
    first_name,
    last_name,
    email,
    password: hashedPassword,
    creation_date: Date.now(),
    active: true,
  })
    .then((newUser) => {
      // Send a notification email to the user (you need to implement this)
      res.status(201).json({
        status: 201,
        message: "User created successfully",
      });
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
        from: process.env.SENDER,
        to: newUser.email,
        subject: `Welcome to Our Ecommerce Project`,
        text: `Hello ${newUser.first_name},\n\nWelcome to Our Ecommerce Project! Your account has been successfully created.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    })
    .catch((error) => {
      // Handle any errors that occur during document creation
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Error creating the user",
      });
    });
};

const getAllUsers = async (req, res, next) => {
  const { page = 1, sort = "ASC" } = req.query;
  const perPage = 10; // Number of users per page

  // Calculate the skip value to implement pagination
  const skip = (page - 1) * perPage;

  // Define the sorting order based on the "sort" parameter
  const sortOrder = sort === "DESC" ? -1 : 1;
  try {
    const Users = await User.find()
      .skip(skip)
      .limit(perPage)
      .sort({ creation_date: sortOrder });
    res.status(200).json({
      status: 200,
      data: Users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const searchUser = async (req, res, next) => {
  try {
    let { query, page = 1, sort = "DESC" } = req.query;
    const perPage = 10; // Number of users per page

    // Calculate the skip value to implement pagination
    const skip = (page - 1) * perPage;

    // Define the sorting order based on the "sort" parameter
    const sortOrder = sort === "DESC" ? -1 : 1;

    // Build the Mongoose query for searching users
    const searchQuery = {
      $or: [
        { first_name: { $regex: new RegExp(query, "i") } }, // Case-insensitive search
        { last_name: { $regex: new RegExp(query, "i") } },
        { user_name: { $regex: new RegExp(query, "i") } },
        { email: { $regex: new RegExp(query, "i") } },
      ],
    };
    // Build the complete query
    query = User.find(searchQuery)
      .skip(skip)
      .limit(perPage)
      .sort({ creation_date: sortOrder });

    // Execute the query
    const users = await query.exec();

    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getUserDetails = async (req, res, next) => {
  const Users = await User.find();
  const userId = req.params.id;
  try {
    const matchingUser = Users.find((user) => {
      return user.id === userId;
    });
    if (matchingUser) {
      res.status(200).json({
        status: 200,
        data: matchingUser,
      });
    } else {
      res.status(200).json({
        status: 404,
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
    const userId = req.params.id; // Get the user's ID from the route parameter
    const { role, first_name, last_name, user_name, email, password, active } =
      req.body;
    const invalidFields = [];

    // Find the existing user by their ID
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        status: 404,
        message: "Invalid user id",
      });
    }

    // Validate the request body to ensure data types
    if (typeof role !== "string") {
      invalidFields.push("role");
    }
    if (typeof first_name !== "string") {
      invalidFields.push("first_name");
    }
    if (typeof last_name !== "string") {
      invalidFields.push("last_name");
    }
    if (typeof last_name !== "string") {
      invalidFields.push("user_name");
    }
    if (typeof email !== "string") {
      invalidFields.push("email");
    }
    if (typeof password !== "string") {
      invalidFields.push("password");
    }
    if (typeof active !== "boolean") {
      invalidFields.push("active");
    }

    if (invalidFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `Bad request. The following fields have invalid data types: ${invalidFields.join(
          ", "
        )}`,
      });
    }

    // Update the user properties
    existingUser.role = role;
    existingUser.first_name = first_name;
    existingUser.last_name = last_name;
    existingUser.user_name = user_name;
    existingUser.email = email;
    existingUser.password = password;
    existingUser.active = active;
    existingUser.last_update = new Date();

    await existingUser.save();

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await User.findOneAndDelete({ _id: userId });

    if (!existingUser) {
      res.status(404).json({
        status: 404,
        message: "Invalid User id",
      });
    } else {
      res.status(200).json({
        status: 200,
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

    if (user && user.active === true) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Generate JWT token
        const payload = {
          id: user._id,
          role: user.role,
          expiration: Date.now() + parseInt(expiration),
          // ...other payload data you want to include
        };
        const accessToken = jwt.sign(JSON.stringify(payload), secretKey); // Token expires in 1 hour

        res.cookie("user_access_token", accessToken, {
          httpOnly: true,
          secure: false, //--> SET TO TRUE ON PRODUCTION
        });

        // Generate Refresh Token
        const refreshTokenPayload = {
          id: user._id,
          role: user.role,
          expiration: Date.now() + parseInt(expiration),
          // ...other payload data
        };
        const refreshToken = jwt.sign(refreshTokenPayload, secretRefreshKey, {
          expiresIn: "7d",
        });

        res.cookie("user_refresh_token", refreshToken, {
          httpOnly: true,
          secure: false, //--> SET TO TRUE ON PRODUCTION
        });

        // Update last_login
        user.last_login = new Date();
        await user.save();

        // User is now authenticated and session is established
        return res.status(200).json({
          status: 200,
          message: "Login success",
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: "1h",
          refresh_token: refreshToken,
          user: user,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials or inactive account" });
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

const logOut = async (req, res) => {
  if (req.cookies["user_access_token"]) {
    res.clearCookie("user_access_token").status(200);
    res.clearCookie("user_refresh_token").status(200).json({
      message: "Logout successful",
    });
  } else {
    res.status(401).json({
      error: "Invalid jwt",
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserDetails,
  searchUser,
  updateUser,
  deleteUser,
  loginUser,
  logOut,
};

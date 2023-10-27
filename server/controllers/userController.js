const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { createTransport } = require("nodemailer");
const passport = require("passport");
const { log } = require("console");
const jwtSecret = process.env.SECRETKEY;
const expirationDate = process.env.EXPIRATIONDATE;

const createUser = async (req, res) => {
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

  // Create a new user using the create() method
  User.create({
    role,
    user_name,
    first_name,
    last_name,
    email,
    password,
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
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        secure: false,
        auth: {
          user: "cd17faf293a75f",
          pass: "f3108b781b86ce",
        },
      });

      const mailOptions = {
        from: process.env.SENDER,
        to: email,
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

    if (categories.length === 0) {
      return res.status(200).json({
        status: 404,
        data: {},
      });
    }

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
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, async (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      // Generate JWT token
      const payload = {
        id: user._id,
        role: user.role,
        expiration: Date.now() + parseInt(expirationDate),
        // ...other payload data you want to include
      };
      const accessToken = jwt.sign(JSON.stringify(payload), jwtSecret); // Token expires in 1 hour

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: false, //--> SET TO TRUE ON PRODUCTION
      });

      // Generate Refresh Token
      const refreshTokenPayload = {
        id: user._id,
        role: user.role,
        expiration: Date.now() + parseInt(expirationDate),
        // ...other payload data
      };
      const refreshToken = jwt.sign(
        refreshTokenPayload,
        process.env.REFRESHSECRETLEY,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("jwtRefresh", refreshToken, {
        httpOnly: true,
        secure: false, //--> SET TO TRUE ON PRODUCTION
      });

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
    });
  })(req, res, next);
};

const logOut = async (req, res) => {
  if (req.cookies["jwt"]) {
    res.clearCookie("jwt").status(200).json({
      message: "You have logged out",
    });
  } else {
    res.status(401).json({
      error: "Invalid jwt",
    });
  }
};

const refreshTokenMiddleware = async (req, res, next) => {
  // Get the access token from the request cookies
  const accessToken = req.cookies["jwt"];

  // If the access token is expired, try to refresh it
  if (Date.now() > jwt.decode(accessToken).expiration) {
    // Get the refresh token from the request cookies
    const refreshToken = req.cookies["jwtRefresh"];

    if (!refreshToken) {
      return next("Unauthorized: Refresh token not found");
    }

    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESHSECRETLEY
      );

      // Generate a new access token
      const payload = {
        id: decodedRefreshToken.id,
        role: decodedRefreshToken.role,
        expiration: Date.now() + parseInt(expirationDate),
        // ...other payload data you want to include
      };
      const newAccessToken = jwt.sign(JSON.stringify(payload), jwtSecret); // Token expires in 1 hour

      // Set the new access token in the response cookie
      res.cookie("jwt", newAccessToken, {
        httpOnly: true,
        secure: false, //--> SET TO TRUE ON PRODUCTION
      });
    } catch (error) {
      return next("Unauthorized: Refresh token invalid");
    }
  }

  // Continue with the request
  next();
};

module.exports = {
  createUser,
  getAllUsers,
  getUserDetails,
  searchUser,
  updateUser,
  deleteUser,
  loginUser,
  refreshTokenMiddleware,
  logOut,
};

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const { User } = require("../models/User");
const { database } = require("../config/database");
const { Category } = require("../models/Category");
const JWTStrategy = passportJWT.Strategy;

// Configure the Passport Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "user_name",
      passwordField: "password",
    },
    async (user_name, password, done) => {
      try {
        // Find the user by user_name in your database
        const user = await User.findOne({ user_name });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // Check if the user is active
        if (!user.active) {
          return done(null, false, { message: "User is not active" });
        }

        // Check the password
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        // Update the last_login timestamp
        user.last_login = Date.now();
        await user.save();

        // Successful authentication
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies["jwt"];
  }

  return jwt;
};

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.SECRETKEY,
    },
    (jwtPayload, done) => {
      const { expiration } = jwtPayload;
      done(null, jwtPayload);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware
  }
  // User is not authenticated, redirect to the login page or send an error response
  res.status(401).json({ message: "Unauthorized" });
};

const requireAdmin = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // User not authenticated
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    if (user.role === "admin") {
      // User has admin privileges
      next();
    } else {
      // User does not have admin privileges
      res.status(403).json({
        status: 403,
        message: "You don't have enough privilege",
      });
    }
  })(req, res, next);
};

const requireAdminOrManager = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // User not authenticated
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    if (user.role === "admin" || user.role === "manager") {
      // User has admin privileges
      next();
    } else {
      // User does not have admin privileges
      res.status(403).json({
        status: 403,
        message: "You don't have enough privilege",
      });
    }
  })(req, res, next);
};

module.exports = { isAuthenticated, requireAdmin, requireAdminOrManager };

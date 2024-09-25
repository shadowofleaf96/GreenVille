require("dotenv").config({ path: "../.env" });
const { User } = require("../models/User");
const { Customer } = require("../models/Customer");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({
            message: "This session has expired. Please login",
          });
      }

      const { id, role } = decoded;
      let user;

      if (!role) {
        user = await Customer.findById(id);
      } else if (role) {
        user = await User.findById(id);
      } else {
        return res.status(401).json({ message: "Invalid user role" });
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { password, ...data } = user._doc;
      req.user = data;
      next();
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
};

const requireAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role && role.includes("admin")) {
    next();
  } else {
    return res.status(403).json({ message: "You don't have enough privilege" });
  }
};

const requireAdminOrManager = (req, res, next) => {
  const { role } = req.user;
  if (role && (role.includes("admin") || role.includes("manager"))) {
    next();
  } else {
    return res.status(403).json({ message: "You don't have enough privilege" });
  }
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireAdminOrManager,
};

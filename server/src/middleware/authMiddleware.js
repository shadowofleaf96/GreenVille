import { User } from "../models/User.js";
import { Customer } from "../models/Customer.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.sendStatus(401);
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
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

      const { ...data } = user._doc;
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

export const optionalVerifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next();
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return next();
      }

      const { id, role } = decoded;
      let user;

      if (!role) {
        user = await Customer.findById(id);
      } else if (role) {
        user = await User.findById(id);
      }

      if (user) {
        const { ...data } = user._doc;
        req.user = data;
      }
      next();
    });
  } catch (err) {
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.sendStatus(401);
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "This session has expired. Please login",
        });
      }

      const { role } = decoded;
      if (role && role.includes("admin")) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "You don't have enough privilege" });
      }
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

export const requireAdminOrManager = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.sendStatus(401);
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "This session has expired. Please login",
        });
      }

      const { role } = decoded;
      if (
        role &&
        (role.includes("admin") ||
          role.includes("manager") ||
          role.includes("vendor") ||
          role.includes("delivery_boy"))
      ) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "You don't have enough privilege" });
      }
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
// Alias verifyToken as protect to match common conventions and recent imports
export const protect = verifyToken;

const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

router.get("/stats", verifyToken, requireAdminOrManager, getDashboardStats);

module.exports = router;

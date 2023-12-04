const express = require("express");
const router = express.Router();

const {
  createPayment,
  retrievePayments,
  searchPayment,
} = require("../controllers/paymentController");
const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

router.post("/create-payment", createPayment);
router.get("/", 
// verifyToken, 
// requireAdminOrManager, 
retrievePayments);
router.get("/:id", 
// verifyToken, 
// requireAdminOrManager, 
searchPayment);

module.exports = router;

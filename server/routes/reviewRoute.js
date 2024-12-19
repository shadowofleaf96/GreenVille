const express = require("express");
const router = express.Router();
const { verifyToken, requireAdminOrManager } = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

router.post("/", verifyToken, reviewController.createReview);

router.get("/:id", verifyToken, reviewController.getProductReviews);

router.get("/", verifyToken, reviewController.getAllReviews);

router.put("/:id", verifyToken, requireAdminOrManager, reviewController.editReview);

router.delete("/:id", verifyToken, requireAdminOrManager, reviewController.deleteReview);

module.exports = router;

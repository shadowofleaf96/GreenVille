const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use(passport.session());
const {
  isAuthenticated,
  requireAdminOrManager,
} = require("../middleware/authmiddleware");

const {
  createCategory,
  getAllCategories,
  searchCategory,
  getCategoryDetails,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

router.post(
  "/v1/categories",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdminOrManager,
  createCategory,
);
router.put(
  "/v1/categories/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdminOrManager,
  updateCategory
);
router.delete(
  "/v1/categories/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdminOrManager,
  deleteCategory
);
router.get(
  "/v1/categories",
  getAllCategories
);
router.get(
  "/v1/categories/search",
  searchCategory
);
router.get(
  "/v1/categories/:id",
  getCategoryDetails
);

module.exports = router;

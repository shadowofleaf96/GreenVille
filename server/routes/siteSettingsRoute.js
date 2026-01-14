const express = require("express");
const { upload } = require("../middleware/multerMiddleware");
const router = express.Router();
const siteSettingsController = require("../controllers/siteSettingsController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", siteSettingsController.getSettings);
router.put(
  "/",
  verifyToken,
  requireAdmin,
  upload.any(),
  siteSettingsController.updateSettings,
);

module.exports = router;

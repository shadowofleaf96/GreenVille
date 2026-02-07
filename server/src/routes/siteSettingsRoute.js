import express from "express";
import { upload } from "../middleware/multerMiddleware.js";
const router = express.Router();
import * as siteSettingsController from "../controllers/siteSettingsController.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

router.get("/", siteSettingsController.getSettings);
router.put(
  "/",
  verifyToken,
  requireAdmin,
  upload.any(),
  siteSettingsController.updateSettings,
);

export default router;

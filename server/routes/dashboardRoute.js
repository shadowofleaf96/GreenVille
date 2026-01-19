import express from "express";
const router = express.Router();
import { getDashboardStats } from "../controllers/dashboardController.js";
import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";

router.get("/stats", verifyToken, requireAdminOrManager, getDashboardStats);

export default router;

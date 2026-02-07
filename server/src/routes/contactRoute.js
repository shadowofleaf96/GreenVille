import express from "express";
const router = express.Router();
import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";

import {
  createContact,
  replyToContact,
  getAllContactMessages,
  editContact,
  deleteContact,
} from "../controllers/contactController.js";

router.post("/", createContact);

router.post("/reply", replyToContact);

router.get("/", verifyToken, requireAdminOrManager, getAllContactMessages);

router.put("/:id", verifyToken, requireAdminOrManager, editContact);

router.delete("/:id", verifyToken, requireAdminOrManager, deleteContact);

export default router;

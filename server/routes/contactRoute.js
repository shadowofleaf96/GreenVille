const express = require("express");
const router = express.Router();
const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

const contactController = require("../controllers/contactController");

router.post("/", contactController.createContact);

router.post("/reply", contactController.replyToContact);

router.get(
  "/",
  verifyToken,
  requireAdminOrManager,
  contactController.getAllContactMessages
);

router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  contactController.editContact
);

router.delete(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  contactController.deleteContact
);

module.exports = router;

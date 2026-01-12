const express = require("express");
const router = express.Router();
const controller = require("../controllers/localizationController");

router.get("/", controller.getAllLocalizations);
router.put("/", controller.upsertLocalization);
router.delete("/:id", controller.deleteLocalization);

module.exports = router;

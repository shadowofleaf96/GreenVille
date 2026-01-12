const express = require("express");
const router = express.Router();
const controller = require("../controllers/localeController");

router.get("/:lng", controller.getLocale);

module.exports = router;

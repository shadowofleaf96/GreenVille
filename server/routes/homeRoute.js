const express = require("express");
const router = express.Router();
require("dotenv").config();


router.get("/", (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;

import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

export default router;

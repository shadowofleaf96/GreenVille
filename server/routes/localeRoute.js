import express from "express";
const router = express.Router();
import * as controller from "../controllers/localeController.js";

router.get("/:lng", controller.getLocale);

export default router;

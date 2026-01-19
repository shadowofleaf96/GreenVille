import express from "express";
const router = express.Router();
import * as controller from "../controllers/localizationController.js";

router.get("/", controller.getAllLocalizations);
router.put("/", controller.upsertLocalization);
router.delete("/:id", controller.deleteLocalization);

export default router;

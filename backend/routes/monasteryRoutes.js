import express from "express";
import * as monasteryController from "../controllers/monasteryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", monasteryController.getMonasteries);
router.get("/:id", monasteryController.getMonastery);
router.post("/", protect, monasteryController.createMonastery);
router.put("/:id", protect, monasteryController.updateMonastery);
router.delete("/:id", protect, monasteryController.deleteMonastery);

export default router;

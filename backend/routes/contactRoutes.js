import express from "express";
import * as contactController from "../controllers/contactController.js";

const router = express.Router();

router.post("/message", contactController.sendContactMessage);
router.post("/ai-chat", contactController.aiChat);
router.post("/trip-planner", contactController.generateTripPlan);

export default router;

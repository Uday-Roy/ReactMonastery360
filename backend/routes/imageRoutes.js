import express from "express";
import * as imageController from "../controllers/imageController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", imageController.getImages);
router.post(
  "/",
  protect,
  allowRoles("admin", "editor"),
  imageController.createImage,
);
router.put(
  "/:id",
  protect,
  allowRoles("admin", "editor"),
  imageController.updateImage,
);
router.delete(
  "/:id",
  protect,
  allowRoles("admin", "editor"),
  imageController.deleteImage,
);

export default router;

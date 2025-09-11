import express from "express";
import {
  createFreeVideo,
  getFreeVideos,
  getFreeVideoById,
  updateFreeVideo,
  deleteFreeVideo,
} from "../controllers/freeVideoController.js";

const router = express.Router();

router.post("/", createFreeVideo);
router.get("/", getFreeVideos);
router.get("/:id", getFreeVideoById);
router.put("/:id", updateFreeVideo);
router.delete("/:id", deleteFreeVideo);

export default router;

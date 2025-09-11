import express from "express";
import {
  createLiveClass,
  getLiveClasses,
  getLiveClassById,
  updateLiveClass,
  deleteLiveClass,
} from "../controllers/liveClassController.js";

const router = express.Router();

router.post("/", createLiveClass);
router.get("/", getLiveClasses);
router.get("/:id", getLiveClassById);
router.put("/:id", updateLiveClass);
router.delete("/:id", deleteLiveClass);

export default router;

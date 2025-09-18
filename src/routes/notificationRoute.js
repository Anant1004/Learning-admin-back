import express from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
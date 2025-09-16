import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

const createNotification = async (req, res) => {
    try {
      const { title, message, sendTo, specificUser } = req.body;
  
      if (!title || !message || !sendTo) {
        return res
          .status(400)
          .json({ success: false, message: "Title, message and sendTo are required" });
      }
  
      const validSendTo = ["All Users", "Students Only", "Instructors Only", "Specific User"];
      if (!validSendTo.includes(sendTo)) {
        return res.status(400).json({ success: false, message: "Invalid sendTo value" });
      }
  
      let userEmail = null;
  
      if (sendTo === "Specific User") {
        const user = await User.findOne({ email: specificUser });
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        userEmail = user.email;
  
        console.log(`📩 Notification will be sent to user: ${userEmail}`);
      }
  
      const notification = new Notification({
        title,
        message,
        sendTo,
        specificUser: sendTo === "Specific User" ? userEmail : null,
      });
  
      await notification.save();
  
      res.status(201).json({
        success: true,
        message: sendTo === "Specific User"
          ? `Notification created and sent to ${userEmail}`
          : "Notification created successfully",
        data: notification,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .populate("specificUser", "-password -__v -created_at -updatedAt")
            .select("-__v -createdAt -updatedAt");
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { userId } = req.body;

        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        // check if already read
        const alreadyRead = notification.readBy.find((r) => r.userId.toString() === userId);
        if (!alreadyRead) {
            notification.readBy.push({ userId, readAt: new Date() });
            await notification.save();
        }

        res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { createNotification, getNotifications, getNotificationById, markAsRead, deleteNotification };
const express = require("express");
const router = express.Router();

const notificationController = require("../../controllers/APIs/notificationController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

// Get paginated notifications
router.get("/", authMiddleware, notificationController.getMyNotifications);

// Unread count (for badge)
router.get(
  "/unread-count",
  authMiddleware,
  notificationController.getUnreadCount
);

// Mark all as read
router.put("/read-all", authMiddleware, notificationController.markAllAsRead);

// Clear all
router.delete("/clear-all", authMiddleware, notificationController.clearAll);

// Mark one as read
router.put("/:id/read", authMiddleware, notificationController.markAsRead);

// Delete one
router.delete("/:id", authMiddleware, notificationController.deleteNotification);

module.exports = router;
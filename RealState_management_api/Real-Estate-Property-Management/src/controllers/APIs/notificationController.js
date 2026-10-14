const mongoose = require("mongoose");
const Notification = require("../../models/notificationModel");

class NotificationController {
  // =====================================================
  // GET MY NOTIFICATIONS (paginated)
  // =====================================================
  async getMyNotifications(req, res) {
    try {
      const userId = req.user._id;
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
      const skip = (page - 1) * limit;

      const { isRead, type, role } = req.query;

      const filter = { recipient: userId };
      if (isRead !== undefined) filter.isRead = isRead === "true";
      if (type) filter.type = type;
      if (role) filter.recipientRole = role;

      const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(filter)
          .populate("sender", "name image role")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Notification.countDocuments(filter),

        Notification.countDocuments({
          recipient: userId,
          isRead: false,
        }),
      ]);

      return res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
        pagination: {
          currentPage: page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get Notifications:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
      });
    }
  }

  // =====================================================
  // UNREAD COUNT (for badge)
  // =====================================================
  async getUnreadCount(req, res) {
    try {
      const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      });

      return res.status(200).json({
        success: true,
        unreadCount,
      });
    } catch (error) {
      console.error("Get Unread Count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get unread count",
      });
    }
  }

  // =====================================================
  // MARK ONE AS READ
  // =====================================================
  async markAsRead(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID",
        });
      }

      const notification = await Notification.findOneAndUpdate(
        { _id: id, recipient: req.user._id },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      console.error("Mark As Read:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to mark as read",
      });
    }
  }

  // =====================================================
  // MARK ALL AS READ
  // =====================================================
  async markAllAsRead(req, res) {
    try {
      const result = await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return res.status(200).json({
        success: true,
        message: "All marked as read",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Mark All Read:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to mark all as read",
      });
    }
  }

  // =====================================================
  // DELETE ONE
  // =====================================================
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findOneAndDelete({
        _id: id,
        recipient: req.user._id,
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error) {
      console.error("Delete Notification:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete",
      });
    }
  }

  // =====================================================
  // CLEAR ALL
  // =====================================================
  async clearAll(req, res) {
    try {
      const result = await Notification.deleteMany({
        recipient: req.user._id,
      });

      return res.status(200).json({
        success: true,
        message: "All notifications cleared",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error("Clear All:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to clear",
      });
    }
  }
}

module.exports = new NotificationController();
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};



exports.markNotificationRead = async (req, res) => {
  try {

    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }
    
    const notification =
    await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new : true,
      }
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
      message: "Notification marked as read",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};



exports.markAllNotificationsRead =
  async (req, res) => {
    try {

      await Notification.updateMany(
        {
          user: req.user.id,
          isRead: false,
        },
        {
          isRead: true,
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to update notifications",
      });
    }
  };
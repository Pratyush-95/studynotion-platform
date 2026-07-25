const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadNotificationCount,
  deleteNotification,
  deleteAllNotifications,

} = require("../controllers/Notification");

const { auth } = require("../middlewares/auth");

router.get(
  "/get-notifications",
  auth,
  getNotifications
);

router.put(
  "/mark-read",
  auth,
  markNotificationRead
);

router.put(
  "/mark-all-read",
  auth,
  markAllNotificationsRead
);

router.get(
  "/unread-count",
  auth,
  getUnreadNotificationCount
);

router.delete(
  "/delete/:notificationId",
  auth,
  deleteNotification
);

router.delete(
  "/delete-all",
  auth,
  deleteAllNotifications
);

module.exports = router;
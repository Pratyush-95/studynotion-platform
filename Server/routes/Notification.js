const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markNotificationRead,
   markAllNotificationsRead,
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

module.exports = router;
const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");

const {
  searchUser,
  viewUserProfile,
  toggleUserStatus,
  sendNotification,
  deleteUser,
  getPublishedCourses,
} = require("../controllers/AdminUserManagement");

// =========================================
// Search Student / Instructor / All Users
// =========================================
router.get(
  "/search-user",
  auth,
  isAdmin,
  searchUser
);

// =========================================
// Get Complete User Details
// =========================================

router.get(
  "/user-profile/:userId",
  auth,
  isAdmin,
  viewUserProfile
);

// =========================================
// Toggle User Active / Inactive Status
// =========================================

router.patch(
  "/toggle-user-status/:userId",
  auth,
  isAdmin,
  toggleUserStatus
);

router.post(
  "/send-notification",
  auth,
  isAdmin,
  sendNotification
);


// =========================================
// Delete User
// =========================================

router.delete(
  "/delete-user/:userId",
  auth,
  isAdmin,
  deleteUser
);

router.get(
  "/instructor/:userId/published-courses",
  auth,
  isAdmin,
  getPublishedCourses
);

module.exports = router;
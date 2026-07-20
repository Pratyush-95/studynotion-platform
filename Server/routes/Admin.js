const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");

const {
  getPendingInstructors,
  getApprovedInstructors,
  getRejectedInstructors,
  approveInstructor,
  rejectInstructor,
  getDashboardStats,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getAdminDashboard,
  getRecentActivities,
  deleteActivity,
  markActivityAsRead,
  getInstructorStudents,
  getApprovedCourses,
  getRejectedCourses,
} = require("../controllers/Admin");

router.get(
  "/pending-instructors",
  auth,
  isAdmin,
  getPendingInstructors
);

router.patch(
  "/instructors/:instructorId/approve",
  auth,
  isAdmin,
  approveInstructor
);

router.delete(
  "/instructors/:instructorId/reject",
  auth,
  isAdmin,
  rejectInstructor
);

router.get(
  "/dashboard-stats",
  auth,
  isAdmin,
  getDashboardStats
);

router.get(
  "/approved-instructors",
  auth,
  isAdmin,
  getApprovedInstructors
);

router.get(
  "/rejected-instructors",
  auth,
  isAdmin,
  getRejectedInstructors
);

router.get(
  "/pending-courses",
  auth,
  isAdmin,
  getPendingCourses
);

router.patch(
  "/courses/:courseId/approve",
  auth,
  isAdmin,
  approveCourse
);

router.patch(
  "/courses/:courseId/reject",
  auth,
  isAdmin,
  rejectCourse
);

router.get(
  "/dashboard",
  auth,
  isAdmin,
  getAdminDashboard
);

router.get(
  "/recent-activities",
  auth,
  isAdmin,
  getRecentActivities
);

router.delete(
  "/activity/:activityId",
  auth,
  deleteActivity
);

router.patch(
  "/activity/:activityId/read",
  auth,
  isAdmin,
  markActivityAsRead
);

router.get(
  "/instructor/:userId/students",
  auth,
  isAdmin,
  getInstructorStudents
);

router.get(
  "/approved-courses",
  auth,
  isAdmin,
  getApprovedCourses
);

router.get(
  "/rejected-courses",
  auth,
  isAdmin,
  getRejectedCourses
);

module.exports = router;
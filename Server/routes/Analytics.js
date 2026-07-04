const express = require("express");
const router = express.Router();

const { auth, isInstructor ,isAdmin, }
= require("../middlewares/auth");

const {
  getInstructorAnalytics,
  getAdminRevenueAnalytics,
} = require("../controllers/Analytics");

router.get(
  "/instructor",
  auth,
  isInstructor,
  getInstructorAnalytics
);

router.get(
  "/admin-revenue",
  auth,
  isAdmin,
  getAdminRevenueAnalytics
);
module.exports = router;
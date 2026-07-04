const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

const {
  getRecentActivities,
} = require("../controllers/Admin");

router.get(
  "/recent-activities",
  auth,
  getRecentActivities
);

module.exports = router;
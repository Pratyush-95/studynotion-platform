const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
  requestAccountDeletion,
  cancelAccountDeletion,
  checkPhoneNumber
} = require("../controllers/Profile");

router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

router.post(
  "/request-account-deletion",
  auth,
  requestAccountDeletion
);

router.post(
  "/cancel-account-deletion",
  auth,
  cancelAccountDeletion
);



router.post(
  "/check-phone",
  auth,
  checkPhoneNumber
);

module.exports = router;
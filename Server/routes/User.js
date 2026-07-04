const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  changePassword,
  googleAuth,
  logout,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

router.post("/login", login);

router.post("/signup", signup);

router.post("/sendotp", sendotp);

router.post("/changepassword", auth, changePassword);

router.post("/google", googleAuth);

router.post("/reset-password-token", resetPasswordToken);

router.post("/reset-password", resetPassword);

router.post(
  "/logout",
  auth,
  logout
);

module.exports = router;
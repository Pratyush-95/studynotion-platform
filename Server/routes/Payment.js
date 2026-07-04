const express = require("express");
const router = express.Router();
const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
  
} = require("../controllers/Payments");

const { auth, isStudent } = require("../middlewares/auth");
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

// get user orders
const { getUserOrders } = require("../controllers/Payments");
router.get("/getOrders", auth, isStudent, getUserOrders);

// backfill legacy orders for a user (creates an order from enrolled courses if no orders exist)
const { backfillMyOrders } = require("../controllers/Payments");
router.post("/backfillMyOrders", auth, isStudent, backfillMyOrders);

module.exports = router;
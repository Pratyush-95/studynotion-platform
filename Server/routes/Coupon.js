const express = require("express");

const router = express.Router();

const {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getActiveCoupon,
} = require("../controllers/Coupon");

const {
  auth,
  isAdmin,
} = require("../middlewares/auth");

router.post(
  "/create",
  auth,
  isAdmin,
  createCoupon
);

router.get(
  "/active",
  getActiveCoupon
);

router.get(
  "/",
  auth,
  isAdmin,
  getCoupons
);

router.put(
  "/:couponId",
  auth,
  isAdmin,
  updateCoupon
);

router.delete(
  "/:couponId",
  auth,
  isAdmin,
  deleteCoupon
);

router.post(
  "/apply",
  auth,
  applyCoupon
);

router.post(
  "/validate",
  auth,
  validateCoupon
);

module.exports = router;
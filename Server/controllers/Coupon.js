const Coupon = require("../models/Coupon");


// ==========================================================
// Create Coupon
// ==========================================================
exports.createCoupon = async (req, res) => {
  try {

    const {
      code,
      description,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      expiryDate,
      maxUses,
    } = req.body;

    // ---------------- Validation ----------------

    if (
      !code ||
      !discountType ||
      !discountValue ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }

    if (
      discountType !== "PERCENTAGE" &&
      discountType !== "FIXED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Discount Type",
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount must be greater than 0",
      });
    }

    if (
      discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100%",
      });
    }

    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Expiry date must be a future date",
      });
    }

    // ---------------- Duplicate Coupon ----------------

    const alreadyExists = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    // ---------------- Create Coupon ----------------

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumPurchase:
        minimumPurchase || 0,
      maximumDiscount:
        maximumDiscount || 0,
      expiryDate,
      maxUses: maxUses || 100,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message:
        "Coupon created successfully",
      data: coupon,
    });

  }

  catch (error) {

    console.log("CREATE_COUPON_ERROR", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================================================
// Get All Coupons
// ==========================================================
exports.getCoupons = async (req, res) => {

  try {

    const coupons = await Coupon.find()
      .populate(
        "createdBy",
        "firstName lastName email"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });

  }

  catch (error) {

    console.log("GET_COUPONS_ERROR", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// ==========================================================
// Update Coupon
// ==========================================================
exports.updateCoupon = async (req, res) => {
  try {

    const { couponId } = req.params;

    const {
      description,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      expiryDate,
      maxUses,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (
      discountType &&
      discountType !== "PERCENTAGE" &&
      discountType !== "FIXED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Discount Type",
      });
    }

    if (
      discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage cannot exceed 100%",
      });
    }

    if (
      expiryDate &&
      new Date(expiryDate) <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Expiry date should be future date",
      });
    }

    coupon.description =
      description ?? coupon.description;

    coupon.discountType =
      discountType ?? coupon.discountType;

    coupon.discountValue =
      discountValue ?? coupon.discountValue;

    coupon.minimumPurchase =
      minimumPurchase ?? coupon.minimumPurchase;

    coupon.maximumDiscount =
      maximumDiscount ?? coupon.maximumDiscount;

    coupon.expiryDate =
      expiryDate ?? coupon.expiryDate;

    coupon.maxUses =
      maxUses ?? coupon.maxUses;

    coupon.isActive =
      isActive ?? coupon.isActive;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });

  } catch (error) {

    console.log("UPDATE_COUPON_ERROR", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================================
// Delete Coupon
// ==========================================================
exports.deleteCoupon = async (req, res) => {

  try {

    const { couponId } = req.params;

    const coupon =
      await Coupon.findById(couponId);

    if (!coupon) {

      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });

    }

    await Coupon.findByIdAndDelete(couponId);

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });

  }

  catch (error) {

    console.log("DELETE_COUPON_ERROR", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// ==========================================================
// Validate Coupon
// ==========================================================
exports.validateCoupon = async (req, res) => {

  try {

    const { code, amount } = req.body;

    if (!code || amount == null) {

      return res.status(400).json({
        success: false,
        message:
          "Coupon code and amount are required",
      });

    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {

      return res.status(404).json({
        success: false,
        message: "Invalid Coupon",
      });

    }

    if (!coupon.isActive) {

      return res.status(400).json({
        success: false,
        message: "Coupon is inactive",
      });

    }

    if (coupon.expiryDate < new Date()) {

      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });

    }

    if (coupon.usedCount >= coupon.maxUses) {

      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded",
      });

    }

    if (amount < coupon.minimumPurchase) {

      return res.status(400).json({
        success: false,
        message:
          `Minimum purchase should be ₹${coupon.minimumPurchase}`,
      });

    }

    return res.status(200).json({

      success: true,

      message: "Coupon is valid",

      data: coupon,

    });

  }

  catch (error) {

    console.log("VALIDATE_COUPON_ERROR", error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ==========================================================
// Apply Coupon
// ==========================================================
exports.applyCoupon = async (req, res) => {

  try {

    const { code, amount } = req.body;

    if (!code || amount == null) {

      return res.status(400).json({
        success: false,
        message:
          "Coupon code and amount are required",
      });

    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {

      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });

    }

    if (!coupon.isActive) {

      return res.status(400).json({
        success: false,
        message: "Coupon inactive",
      });

    }

    if (coupon.expiryDate < new Date()) {

      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });

    }

    if (coupon.usedCount >= coupon.maxUses) {

      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached",
      });

    }

    if (amount < coupon.minimumPurchase) {

      return res.status(400).json({
        success: false,
        message:
          `Minimum purchase should be ₹${coupon.minimumPurchase}`,
      });

    }

    let discount = 0;

    if (coupon.discountType === "PERCENTAGE") {

      discount =
        (amount * coupon.discountValue) / 100;

      if (
        coupon.maximumDiscount > 0 &&
        discount > coupon.maximumDiscount
      ) {

        discount = coupon.maximumDiscount;

      }

    } else {

      discount = coupon.discountValue;

    }

    if (discount > amount) {
      discount = amount;
    }

    const finalAmount =
      amount - discount;

    return res.status(200).json({

      success: true,

      message:
        "Coupon applied successfully",

      data: {

        couponCode: coupon.code,

        originalAmount: amount,

        discount,

        finalAmount,

        saved: discount,

      },

    });

  }

  catch (error) {

    console.log("APPLY_COUPON_ERROR", error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
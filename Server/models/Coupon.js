const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      default: "PERCENTAGE",
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minimumPurchase: {
      type: Number,
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    maxUses: {
      type: Number,
      default: 100,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
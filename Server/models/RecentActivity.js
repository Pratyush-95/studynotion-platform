const mongoose = require("mongoose");

const recentActivitySchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "INSTRUCTOR_APPROVED",
        "INSTRUCTOR_REJECTED",
        "COURSE_APPROVED",
        "COURSE_REJECTED",
        "COURSE_CREATED",
        "SUPPORT_TICKET",
        "PAYMENT_SUCCESS",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

recentActivitySchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  "RecentActivity",
  recentActivitySchema
);
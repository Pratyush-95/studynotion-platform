const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "ACCOUNT_APPROVED",
        "ACCOUNT_REJECTED",
        "COURSE_APPROVED",
        "COURSE_REJECTED",
        "TICKET_REPLY",
        "NEW_ENROLLMENT",
        "GENERAL",
      ],
      default: "GENERAL",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
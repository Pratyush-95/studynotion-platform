const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Account Approval",
        "Course Approval",
        "Payment Issue",
        "Technical Issue",
        "Feature Request",
        "Other",
      ],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Resolved", "Rejected"],
      default: "Pending",
    },

    adminReply: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SupportTicket",
  supportTicketSchema
);
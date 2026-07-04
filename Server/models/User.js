const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique:true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },

    isDeleteRequested: {
      type: Boolean,
      default: false,
    },

    deleteAt: {
      type: Date,
      default: null,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
    },

  lastLogin: {
  type: Date,
  default: null,
},

lastLogout: {
  type: Date,
  default: null,
},

browser: {
  type: String,
  default: "",
},

ipAddress: {
  type: String,
  default: "",
},
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
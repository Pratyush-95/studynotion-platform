const mongoose = require("mongoose");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const Order = require("../models/Order");
const Notification = require("../models/Notification");
const SupportTicket = require("../models/SupportTicket");
const CourseProgress = require("../models/CourseProgress");
const RatingAndReview = require("../models/RatingAndReview");

// Search Student / Instructor / All Users
// ==========================================================

exports.searchUser = async (req, res) => {

  try {
    // Get Query Parameters
    // =====================================================

    const {
      query = "",
      role = "all",
      page = 1,
      limit = 10,
    } = req.query;

    // Role Validation
    // =====================================================

    if (
      role !== "all" &&
      role !== "Student" &&
      role !== "Instructor"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // Prepare Search Filter
    // =====================================================

    const filter = {
      accountType: { $in: ["Student", "Instructor"] },
    };

    // Role Filter
    // -----------------------------------------------------

    if (role === "Student" || role === "Instructor") {
      filter.accountType = role;
    }
   
    // =====================================================
// Search Conditions
// =====================================================

if (query.trim()) {

  const searchConditions = [];

  searchConditions.push({
    email: {
      $regex: query,
      $options: "i",
    },
  });

  searchConditions.push({
    firstName: {
      $regex: query,
      $options: "i",
    },
  });

  searchConditions.push({
    lastName: {
      $regex: query,
      $options: "i",
    },
  });

  searchConditions.push({
    $expr: {
      $regexMatch: {
        input: {
          $concat: [
            "$firstName",
            " ",
            "$lastName",
          ],
        },
        regex: query,
        options: "i",
      },
    },
  });

  if (mongoose.Types.ObjectId.isValid(query)) {

    searchConditions.push({
      _id: query,
    });

  }

  filter.$or = searchConditions;

}
    

    

   
    

   
   
    
    

    // Pagination
    // =====================================================

    const skip =
      (Number(page) - 1) * Number(limit);

    // Find Users
    // =====================================================

    const users = await User.find(filter)

      .select(
        "firstName lastName email accountType active approvalStatus image createdAt isDeleteRequested lastLogin lastLogout"
    )

    //   .populate({
    //     path: "additionalDetails",
    //     select: "gender contactNumber -_id",
    //   })

      .sort({
        createdAt: -1,
      })

      .skip(skip)

      .limit(Number(limit));
    // Count
    // =====================================================

    const totalUsers =
      await User.countDocuments(filter);

    // Response
    // =====================================================

    return res.status(200).json({

      success: true,

      searchType:
        role === "all"
          ? "All Users"
          : role,

      query,

      currentPage: Number(page),

      totalPages: Math.ceil(
        totalUsers / Number(limit)
      ),

      count: users.length,

      totalUsers,

      users,

    });

  }

  catch (error) {
    console.log(
      "SEARCH_USER_ERROR",
      error
    );
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================================
// View Complete User Profile
// ==========================================================

exports.viewUserProfile = async (req, res) => {
  try {

    // ======================================================
    // Get User ID
    // ======================================================

    const { userId } = req.params;

    // ======================================================
    // Validate User ID
    // ======================================================

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    // ======================================================
    // Find User
    // ======================================================

    const user = await User.findById(userId)
      .select(
        "firstName lastName email accountType active approvalStatus approved image createdAt additionalDetails isDeleteRequested lastLogin lastLogout browser ipAddress"
      )
      .populate({
        path: "additionalDetails",
        select: "-_id -__v",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // ======================================================
// Instructor Statistics
// ======================================================

let statistics = {};

let courses = [];

let orders = [];
let notifications = [];
let supportTickets = [];

if (user.accountType === "Instructor") {

  // Get All Instructor Courses
  courses = await Course.find({
    instructor: user._id,
  })
    .select(
      "courseName price status thumbnail studentsEnroled category createdAt updatedAt"
    )
    .populate("category", "name")
    .sort({ createdAt: -1 });

  // -----------------------------
  // Total Courses
  // -----------------------------

  const totalCourses = courses.length;

  // -----------------------------
  // Published Courses
  // -----------------------------

  const publishedCourses = courses.filter(
    (course) => course.status === "Published"
  ).length;

  // -----------------------------
  // Pending Courses
  // -----------------------------

  const pendingCourses = courses.filter(
    (course) => course.status === "Pending"
  ).length;

  // -----------------------------
  // Rejected Courses
  // -----------------------------

  const rejectedCourses = courses.filter(
    (course) => course.status === "Rejected"
  ).length;


  
const draftCourses = courses.filter(
  (course) => course.status === "Draft"
).length;
  // -----------------------------
  // Total Students
  // -----------------------------

  const totalStudents = courses.reduce(
    (count, course) =>
      count + (course.studentsEnroled || []).length,
    0
  );

  // -----------------------------
  // Total Revenue
  // -----------------------------

  const totalRevenue = courses.reduce(
    (amount, course) =>
      amount +
      course.price *
        (course.studentsEnroled || []).length,
    0
  );

  statistics = {

    totalCourses,
    draftCourses,

    publishedCourses,

    pendingCourses,

    rejectedCourses,

    totalStudents,

    totalRevenue,

  };

}

  // ======================================================
// Format Courses Response
// ======================================================

courses = courses.map((course) => ({

  id: course._id,

  courseName: course.courseName,

  thumbnail: course.thumbnail,
  category: course.category?.name || "",

  price: course.price,

  status: course.status,

  studentsCount: (course.studentsEnroled || []).length,

  createdAt: course.createdAt,

  updatedAt: course.updatedAt,

}));


// ======================================================
// Student Statistics
// ======================================================

if (user.accountType === "Student") {

  // ---------------------------------------------
  // Get Enrolled Courses
  // ---------------------------------------------

  courses = await Course.find({
    studentsEnroled: user._id,
  })
    .select(
      "courseName thumbnail price instructor status createdAt updatedAt"
    )
    .populate({
      path: "instructor",
      select: "firstName lastName",
    })
    .sort({
      createdAt: -1,
    });

  // ---------------------------------------------
  // Get Orders
  // ---------------------------------------------

  orders = await Order.find({
    userId: user._id,
  })
    .select(
      "orderId paymentId amount originalAmount discountAmount couponCode createdAt"
    )
    .sort({
      createdAt: -1,
    });

  // ---------------------------------------------
  // Student Statistics
  // ---------------------------------------------

  const enrolledCourses = courses.length;

  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  const averageCoursePrice =
    enrolledCourses === 0
      ? 0
      : Math.round(totalSpent / enrolledCourses);

  statistics = {

    enrolledCourses,

    totalOrders,

    totalSpent,

    averageCoursePrice,

  };

  // ---------------------------------------------
  // Clean Courses Response
  // ---------------------------------------------

  courses = courses.map((course) => ({

    id: course._id,

    courseName: course.courseName,

    thumbnail: course.thumbnail,

    instructor:
      course.instructor
        ? `${course.instructor.firstName} ${course.instructor.lastName}`
        : "",

    price: course.price,

    status: course.status,

    createdAt: course.createdAt,

    updatedAt: course.updatedAt,

  }));

  // ---------------------------------------------
  // Clean Orders Response
  // ---------------------------------------------

  orders = orders.map((order) => ({

    orderId: order.orderId,

    paymentId: order.paymentId,

    originalAmount: order.originalAmount,

    discountAmount: order.discountAmount,

    finalAmount: order.amount,

    couponCode: order.couponCode,

    createdAt: order.createdAt,

  }));

}

// ======================================================
// Get User Notifications
// ======================================================

notifications = await Notification.find({
  user: user._id,
})
.select(
  "title message type isRead createdAt"
)
.sort({
  createdAt: -1,
})
.limit(20);

// ======================================================
// Format Notifications
// ======================================================

notifications = notifications.map((notification) => ({

  id: notification._id,

  title: notification.title,

  message: notification.message,

  type: notification.type,

  isRead: notification.isRead,

  createdAt: notification.createdAt,

}));

// ======================================================
// Get User Support Tickets
// ======================================================

supportTickets = await SupportTicket.find({
  createdBy: user._id,
})
.select(
  "category subject status adminReply createdAt updatedAt"
)
.sort({
  createdAt: -1,
})
.limit(20);

// ======================================================
// Format Support Tickets
// ======================================================

supportTickets = supportTickets.map((ticket) => ({

  id: ticket._id,

  category: ticket.category,

  subject: ticket.subject,

  status: ticket.status,

  adminReply: ticket.adminReply,

  createdAt: ticket.createdAt,

  updatedAt: ticket.updatedAt,

}));
    // ======================================================
    // Response Object
    // ======================================================

    const responseData = {

      // -----------------------------
      // Basic Information
      // -----------------------------

      basicInformation: {

        id: user._id,

        firstName: user.firstName,

        lastName: user.lastName,

        email: user.email,
        lastLogin: user.lastLogin,
        lastLogout: user.lastLogout,
        browser: user.browser,
        ipAddress: user.ipAddress,

        accountType: user.accountType,

        approvalStatus: user.approvalStatus,

        approved: user.approved,

        active: user.active,

        image: user.image,

        joinedOn: user.createdAt,

        isDeleteRequested: user.isDeleteRequested,

      },

      // -----------------------------
      // Profile Information
      // -----------------------------

      profileInformation: user.additionalDetails || {
        gender:"",
        dateOfBirth:"",
        contactNumber:"",
        about:"",
      },

      statistics: statistics,
      courses: courses,
      orders: orders,

      // -----------------------------
      // Notifications
      // -----------------------------

      notifications: notifications,

      // -----------------------------
      // Support Tickets
      // -----------------------------

      supportTickets: supportTickets,

    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });

  }

  catch (error) {

    console.log("VIEW_USER_PROFILE_ERROR", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==========================================================
// Toggle User Active / Inactive Status
// ==========================================================

exports.toggleUserStatus = async (req, res) => {

  try {

    // ======================================================
    // Get User ID
    // ======================================================

    const { userId } = req.params;

    // ======================================================
    // Validate User ID
    // ======================================================

    if (!mongoose.Types.ObjectId.isValid(userId)) {

      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });

    }

    // ======================================================
    // Find User
    // ======================================================

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // ======================================================
    // Prevent Admin Deactivation
    // ======================================================

    if (user.accountType === "Admin") {

      return res.status(403).json({
        success: false,
        message: "Admin account cannot be deactivated",
      });

    }

    // ======================================================
    // Toggle Active Status
    // ======================================================

    user.active = !user.active;

    await user.save();

    // ======================================================
    // Create Notification
    // ======================================================

    await Notification.create({

      user: user._id,

      title: user.active
        ? "Account Activated"
        : "Account Deactivated",

      message: user.active
        ? "Your account has been activated by the administrator."
        : "Your account has been deactivated by the administrator.",

      type: "GENERAL",

    });

    // ======================================================
    // Response
    // ======================================================

    return res.status(200).json({

      success: true,

      message: user.active
        ? "User activated successfully"
        : "User deactivated successfully",

      active: user.active,

    });

  }

  catch (error) {

    console.log(
      "TOGGLE_USER_STATUS_ERROR",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ==========================================================
// Send Notification
// ==========================================================

exports.sendNotification = async (req, res) => {

  try {

    // ======================================================
    // Get Request Body
    // ======================================================

    const {
      userId,
      title,
      message,
    } = req.body;

    // ======================================================
    // Validation
    // ======================================================

    if (
      !userId ||
      !title ||
      !message
    ) {

      return res.status(400).json({

        success: false,

        message:
          "User ID, Title and Message are required.",

      });

    }

    // ======================================================
// Length Validation
// ======================================================

if (title.trim().length > 100) {

  return res.status(400).json({

    success: false,

    message: "Title cannot exceed 100 characters.",

  });

}

if (message.trim().length > 200) {

  return res.status(400).json({

    success: false,

    message: "Message cannot exceed 200 characters.",

  });

}

if (!title.trim()) {

  return res.status(400).json({
    success: false,
    message: "Title cannot be empty.",
  });

}

if (!message.trim()) {

  return res.status(400).json({
    success: false,
    message: "Message cannot be empty.",
  });

}
    // ======================================================
    // Validate User ID
    // ======================================================

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid User ID",

      });

    }

    // ======================================================
    // Find User
    // ======================================================

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }

    // ======================================================
    // Prevent Sending Notification To Admin
    // ======================================================

    if (user.accountType === "Admin") {

      return res.status(403).json({

        success: false,

        message:
          "Notifications cannot be sent to admin accounts.",

      });

    }

    // ======================================================
    // Create Notification
    // ======================================================

    const notification =
      await Notification.create({

        user: user._id,

        title: title.trim(),

        message: message.trim(),

        type: "GENERAL",

      });

    // ======================================================
    // Response
    // ======================================================

    return res.status(201).json({

      success: true,

      message:
        "Notification sent successfully.",

      notification,

    });

  }

  catch (error) {

    console.log(
      "SEND_NOTIFICATION_ERROR",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// ==========================================================
// Delete User
// ==========================================================

exports.deleteUser = async (req, res) => {

  try {

    // ======================================================
    // Get User ID
    // ======================================================

    const { userId } = req.params;

    // ======================================================
    // Validate User ID
    // ======================================================

    if (!mongoose.Types.ObjectId.isValid(userId)) {

      return res.status(400).json({

        success: false,

        message: "Invalid User ID",

      });

    }

    // ======================================================
    // Find User
    // ======================================================

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }

    // ======================================================
    // Prevent Admin Delete
    // ======================================================

    if (user.accountType === "Admin") {

      return res.status(403).json({

        success: false,

        message: "Admin account cannot be deleted.",

      });

}

// ======================================================
// Delete Student Data
// ======================================================

if (user.accountType === "Student") {

  // ---------------------------------------------
  // Remove Student From All Enrolled Courses
  // ---------------------------------------------

  await Course.updateMany(
    {
      studentsEnroled: user._id,
    },
    {
      $pull: {
        studentsEnroled: user._id,
      },
    }
  );

  // ---------------------------------------------
  // Delete Course Progress
  // ---------------------------------------------

  await CourseProgress.deleteMany({
    userId: user._id,
  });

  // ---------------------------------------------
  // Delete Student Ratings & Reviews
  // ---------------------------------------------

  const ratings = await RatingAndReview.find({
    user: user._id,
  });

  // Remove Rating IDs From Courses
  for (const rating of ratings) {

    await Course.findByIdAndUpdate(
      rating.course,
      {
        $pull: {
          ratingAndReviews: rating._id,
        },
      }
    );

  }

  // Delete Ratings
  await RatingAndReview.deleteMany({
    user: user._id,
  });

}


  // ======================================================
// Delete Instructor Data
// ======================================================

// ======================================================
// Delete Instructor Data
// ======================================================

if (user.accountType === "Instructor") {

  // ---------------------------------------------
  // Move All Courses To Draft
  // ---------------------------------------------

  await Course.updateMany(
    {
      instructor: user._id,
    },
    {
      $set: {
        status: "Draft",
        rejectionReason:
          "Instructor account deleted by admin.",
      },
    }
  );

}

// ======================================================
// Delete Notifications
// ======================================================

await Notification.deleteMany({
  user: user._id,
});

// ======================================================
// Delete Support Tickets
// ======================================================

await SupportTicket.deleteMany({
  createdBy: user._id,
});

// ======================================================
// Delete Profile
// ======================================================

if (user.additionalDetails) {

  await Profile.findByIdAndDelete(
    user.additionalDetails
  );

}

// ======================================================
// Delete User
// ======================================================

await User.findByIdAndDelete(
  user._id
);

// ======================================================
// Response
// ======================================================

return res.status(200).json({

  success: true,

  message: `${user.accountType} deleted successfully.`,
   deletedUser: {

    id: user._id,

    name: `${user.firstName} ${user.lastName}`,

    email: user.email,

    accountType: user.accountType,

  },

});
  }

  

  catch (error) {

    console.log(
      "DELETE_USER_ERROR",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


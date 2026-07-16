const User = require("../models/User");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Order = require("../models/Order");
const Notification = require("../models/Notification");
//const RecentActivity = require("../models/RecentActivity");
const SupportTicket = require("../models/SupportTicket");


// Get all pending instructors
exports.getPendingInstructors = async (req, res) => {
  try {
    const instructors = await User.find({
      accountType: "Instructor",
      approvalStatus: "Pending",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve instructor
exports.approveInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instructor ID",
      });
    }

    const instructor = await User.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    if (instructor.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "User is not an Instructor",
      });
    }

    if (instructor.approved) {
      return res.status(400).json({
        success: false,
        message: "Instructor already approved",
      });
    }

    instructor.approved = true;
    instructor.approvalStatus = "Approved";
    await instructor.save();

    await Notification.create({
  user: instructor._id,
  title: "Instructor Approved",
  message:
    "Congratulations! Your instructor account has been approved.",
  type: "ACCOUNT_APPROVED",
});

    return res.status(200).json({
      success: true,
      message: "Instructor approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject instructor
exports.rejectInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instructor ID",
      });
    }

    const instructor = await User.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    if (instructor.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "User is not an Instructor",
      });
    }

    if (instructor.approvalStatus === "Rejected") {
        return res.status(400).json({
            success: false,
            message: "Instructor already rejected",
        });
    }


    
    instructor.approved = false;
    instructor.approvalStatus = "Rejected";

    await instructor.save();

    await Notification.create({
  user: instructor._id,
  title: "Instructor Rejected",
  message:
    "Your instructor application has been rejected. Please contact admin.",
  type: "ACCOUNT_REJECTED",
});

    return res.status(200).json({
      success: true,
      message: "Instructor rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      accountType: "Student",
    });

    const totalInstructors = await User.countDocuments({
      accountType: "Instructor",
    });

    const pendingInstructors = await User.countDocuments({
        accountType: "Instructor",
        approvalStatus: "Pending",
    });

    const approvedInstructors = await User.countDocuments({
        accountType: "Instructor",
        approvalStatus: "Approved",
    });

    const rejectedInstructors = await User.countDocuments({
        accountType: "Instructor",
        approvalStatus: "Rejected",
    });

    const totalCourses = await Course.countDocuments();

    const pendingCourses = await Course.countDocuments({
  status: "Pending",
});

const publishedCourses = await Course.countDocuments({
  status: "Published",
});

const rejectedCourses = await Course.countDocuments({
  status: "Rejected",
});

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const monthlyRevenue = await Order.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" },
      revenue: { $sum: "$amount" },
    },
  },
  {
    $sort: { _id: 1 },
  },
]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
    
        totalInstructors,
        
        approvedInstructors,
        pendingInstructors,
        rejectedInstructors,

        totalCourses,

         pendingCourses,
         publishedCourses,
         rejectedCourses,
         
        totalRevenue,
        monthlyRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getApprovedInstructors = async (req, res) => {
  try {
    const instructors = await User.find({
      accountType: "Instructor",
      approvalStatus: "Approved",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getRejectedInstructors = async (req, res) => {
  try {
    const instructors = await User.find({
      accountType: "Instructor",
      approvalStatus: "Rejected",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getPendingCourses = async (req, res) => {
  try {

    const courses = await Course.find({
      status: "Pending",
    })
      .populate(
        "instructor",
        "firstName lastName email"
      )
      .populate("category");

    return res.status(200).json({
      success: true,
      data: courses,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.status = "Published";

    await course.save();

     await Notification.create({
      user: course.instructor,
      title: "Course Approved",
      message: `${course.courseName} has been approved and published.`,
      type: "COURSE_APPROVED",
    });

    return res.status(200).json({
      success: true,
      message: "Course approved successfully",
      data: course,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.rejectCourse = async (req, res) => {
  try {

    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.status = "Rejected";

    await course.save();

     await Notification.create({
      user: course.instructor,
      title: "Course Rejected",
      message: `${course.courseName} has been rejected by admin.`,
      type: "COURSE_REJECTED",
    });

    return res.status(200).json({
      success: true,
      message: "Course rejected successfully",
      data: course,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getRecentActivities = async (req, res) => {
  try {

    const userId = req.user.id;
    const accountType = req.user.accountType;

    let activities = [];

    // ===========================
    // ADMIN
    // ===========================

    if (accountType === "Admin") {

      const [
        recentCourses,
        recentOrders,
        recentTickets,
        recentNotifications,
      ] = await Promise.all([

        Course.find()
          .populate("instructor", "firstName lastName accountType email image")
          .populate(
            "category",
            "name"
          )
          .sort({ createdAt: -1 })
          .limit(10),

        Order.find()
          .populate("userId", "firstName lastName accountType email image")
          .populate("courses", "courseName")
          .sort({ createdAt: -1 })
          .limit(10),

        SupportTicket.find()
          .populate("createdBy", "firstName lastName accountType email image")
          .sort({ createdAt: -1 })
          .limit(10),

        Notification.find()
          .populate("user", "firstName lastName accountType browser ipAddress image email")
          .sort({ createdAt: -1 })
          .limit(10),

      ]);

      recentCourses.forEach(course => {
        activities.push({
          _id: course._id,
          type: "COURSE",
          title: course.courseName,
          message: "New Course Created",
          performedBy: course.instructor,
          status: course.status,
          createdAt: course.createdAt,
           courseName: course.courseName,
           price: course.price,
           category: course.category?.name,
           students: course.studentsEnrolled?.length || 0,
           instructor:`${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`,
        });
      });

      recentOrders.forEach(order => {

        const courseNames =
          order.courses
            .map(c => c.courseName)
            .join(", ");

          activities.push({
            _id: order._id,
            type: "PAYMENT",
            title: "Payment Received",
            message: `${order.userId?.firstName || "Unknown"} purchased ${courseNames}`,
            performedBy: order.userId,
            amount: order.amount,
            status: "SUCCESS",
            createdAt: order.createdAt,
            courseName: courseNames,
            orderId: order._id,
            paymentDate: order.createdAt,
          });

      });

      recentTickets.forEach(ticket => {
        activities.push({
          _id: ticket._id,
          type: "SUPPORT",
          title: ticket.category,
          message: `${ticket.createdBy?.firstName || "Unknown"} raised a ticket`,
          performedBy: ticket.createdBy,
          status: ticket.status,
          createdAt: ticket.createdAt,
        });
      });

    recentNotifications.forEach((notification) => {

      const title = notification.title.toLowerCase();

let subType = "GENERAL";

if (title.includes("deactivated")) {
  subType = "ACCOUNT_DEACTIVATED";
}

else if (title.includes("activated")) {
  subType = "ACCOUNT_ACTIVATED";
}

else if (title.includes("profile")) {
  subType = "PROFILE_UPDATED";
}

else if (title.includes("approved")) {
  subType = "COURSE_APPROVED";
}

else if (title.includes("rejected")) {
  subType = "COURSE_REJECTED";
}

else if (
  notification.notificationType === "TICKET_REPLY"
) {
  subType = "TICKET_REPLY";
}

  activities.push({
    _id: notification._id,
    type: "NOTIFICATION",
    subType,
    title: notification.title || "Notification",
    message: notification.message || "",
    performedBy: notification.user,
    browser: notification.user?.browser,
    ipAddress: notification.user?.ipAddress,
    email: notification.user?.email,
    image: notification.user?.image,
    status: notification.isRead
    ? "READ"
    : "UNREAD",
    createdAt: notification.createdAt,

  });

});

    }

    // ===========================
    // INSTRUCTOR
    // ===========================

    if (accountType === "Instructor") {

      const instructorCourses =
        await Course.find({
          instructor: userId,
        });

      const courseIds =
        instructorCourses.map(c => c._id);

      const [
        instructorOrders,
        instructorNotifications,
        instructorTickets,
      ] = await Promise.all([

        Order.find({
          courses: { $in: courseIds }
        })
          .populate("userId", "firstName lastName accountType email image")
          .populate("courses", "courseName")
          .sort({ createdAt: -1 })
          .limit(10),

        Notification.find({
          user: userId,
        })
        .populate(
          "user",
          "firstName lastName accountType browser ipAddress image email"
        )
          .sort({ createdAt: -1 })
          .limit(10),

        SupportTicket.find({
          createdBy: userId,
        })
          .sort({ createdAt: -1 })
          .limit(10),

      ]);

      instructorOrders.forEach(order => {

        const courseNames =
          order.courses
            .map(c => c.courseName)
            .join(", ");

        activities.push({
           _id: order._id,
          type: "PAYMENT",
          title: "Payment Received",
          message: `${order.userId?.firstName || "Unknown"} purchased ${courseNames}`,
          performedBy: order.userId,
          amount: order.amount,
          status: "SUCCESS",
          createdAt: order.createdAt,
          courseName: courseNames,
          orderId: order._id,
          paymentDate: order.createdAt,
        });

      });

    instructorNotifications.forEach((notification) => {

         const title = notification.title.toLowerCase();

let subType = "GENERAL";

if (title.includes("deactivated")) {
  subType = "ACCOUNT_DEACTIVATED";
}

else if (title.includes("activated")) {
  subType = "ACCOUNT_ACTIVATED";
}

else if (title.includes("profile")) {
  subType = "PROFILE_UPDATED";
}

else if (title.includes("approved")) {
  subType = "COURSE_APPROVED";
}

else if (title.includes("rejected")) {
  subType = "COURSE_REJECTED";
}

else if (
  notification.notificationType === "TICKET_REPLY"
) {
  subType = "TICKET_REPLY";
}

  activities.push({
    _id: notification._id,
    type: "NOTIFICATION",
    subType,
    title: notification.title || "Notification",
    message: notification.message || "",
    performedBy: notification.user,
    browser: notification.user?.browser,
    ipAddress: notification.user?.ipAddress,
    email: notification.user?.email,
    image: notification.user?.image,
    status: notification.isRead
    ? "READ"
    : "UNREAD",
    createdAt: notification.createdAt,
  });

});

      instructorTickets.forEach(ticket => {

        activities.push({
          _id: ticket._id,
          type: "SUPPORT",
          title: ticket.category,
          message: ticket.subject,
          performedBy: ticket.createdBy,
          status: ticket.status,
          createdAt: ticket.createdAt,
        });

      });

    }

    // ===========================
    // STUDENT
    // ===========================

    if (accountType === "Student") {

      const [
        studentOrders,
        studentNotifications,
        studentTickets,
      ] = await Promise.all([

        Order.find({
          userId: userId,
        })
          .populate("courses", "courseName")
          .populate("userId","firstName lastName")
          .sort({ createdAt: -1 })
          .limit(10),

        Notification.find({
          user: userId,
        })
        .populate(
          "user",
          "firstName lastName accountType browser ipAddress image email"
        )
          .sort({ createdAt: -1 })
          .limit(10),

        SupportTicket.find({
          createdBy: userId,
        })
          .sort({ createdAt: -1 })
          .limit(10),

      ]);

      studentOrders.forEach(order => {

        const courseNames =
          order.courses
            .map(c => c.courseName)
            .join(", ");

        activities.push({
          _id: order._id,
          type: "PAYMENT",
          title: "Payment Successful",
          message: `Purchased ${courseNames}`,
          performedBy: order.userId,
          amount: order.amount,
          status: "SUCCESS",
          createdAt: order.createdAt,
          courseName: courseNames,
          orderId: order._id,
          paymentDate: order.createdAt,
        });

      });

  studentNotifications.forEach((notification) => {
    
    const title = notification.title.toLowerCase();

let subType = "GENERAL";

if (title.includes("deactivated")) {
  subType = "ACCOUNT_DEACTIVATED";
}

else if (title.includes("activated")) {
  subType = "ACCOUNT_ACTIVATED";
}

else if (title.includes("profile")) {
  subType = "PROFILE_UPDATED";
}

else if (title.includes("approved")) {
  subType = "COURSE_APPROVED";
}

else if (title.includes("rejected")) {
  subType = "COURSE_REJECTED";
}

else if (
  notification.notificationType === "TICKET_REPLY"
) {
  subType = "TICKET_REPLY";
}
  
  
  activities.push({
    _id: notification._id,
    type: "NOTIFICATION",
    subType,
    title: notification.title || "Notification",
    message: notification.message || "",
    performedBy: notification.user,
    browser: notification.user?.browser,
    ipAddress: notification.user?.ipAddress,
    email: notification.user?.email,
    image: notification.user?.image,
    status: notification.isRead
    ? "READ"
    : "UNREAD",
    createdAt: notification.createdAt,
  });

});

      studentTickets.forEach(ticket => {

        activities.push({
            _id: ticket._id,
          type: "SUPPORT",
          title: ticket.category,
          message: ticket.subject,
          performedBy: ticket.createdBy,
          status: ticket.status,
          createdAt: ticket.createdAt,
        });

      });

    }

    activities.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      count: activities.length,
      generatedAt: new Date(),
      data: activities.slice(0, 20),
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      pendingInstructors,
      approvedInstructors,
      rejectedInstructors,
      totalCourses,
      totalRevenue,
      recentCourses,
      recentActivities,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ accountType: "Student" }),
      User.countDocuments({ accountType: "Instructor" }),
      User.countDocuments({ accountType: "Instructor", approvalStatus: "Pending" }),
      User.countDocuments({ accountType: "Instructor", approvalStatus: "Approved" }),
      User.countDocuments({ accountType: "Instructor", approvalStatus: "Rejected" }),
      Course.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ]),
      Course.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("instructor", "firstName lastName"),
      Notification.find()
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const revenueValue =
      Array.isArray(totalRevenue) && totalRevenue.length > 0
        ? totalRevenue[0].totalRevenue
        : 0;

    const dashboardStats = {
      totalUsers,
      totalStudents,
      totalInstructors,
      pendingInstructors,
      approvedInstructors,
      rejectedInstructors,
      totalCourses,
      totalRevenue: revenueValue,
    };

    return res.status(200).json({
      success: true,
      data: {
        dashboardStats,
        recentCourses,
        recentActivities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





exports.deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { type } = req.query;

    switch (type?.toUpperCase()) {
      case "NOTIFICATION":
        await Notification.findByIdAndDelete(activityId);
        break;

      case "SUPPORT":
        await SupportTicket.findByIdAndDelete(activityId);
        break;


      default:
        return res.status(400).json({
          success: false,
          message: "Invalid activity type",
        });
    }

    return res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete activity",
    });
  }
};



exports.markActivityAsRead = async (req, res) => {
  try {
      
    const { activityId } = req.params;

    const notification = await  Notification.findByIdAndUpdate(
      activityId,
      {
         isRead: true,
      },
      { new: true }
    );
     

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const CourseProgress = require("../models/CourseProgress");

exports.getInstructorStudents = async (req, res) => {
  try {
    const { userId } = req.params;

    // Published Courses of Instructor
    const courses = await Course.find({
      instructor: userId,
      status: "Published",
    })
      .populate({
        path: "studentsEnroled",
        select: "firstName lastName email image active createdAt",
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });

    const students = [];

    for (const course of courses) {
      // Total lectures
      let totalLectures = 0;

      course.courseContent.forEach((section) => {
        totalLectures += section.subSection.length;
      });

      for (const student of course.studentsEnroled) {
        const progress = await CourseProgress.findOne({
          courseID: course._id,
          userId: student._id,
        });

        const completed =
          progress?.completedVideos?.length || 0;

        const progressPercent =
          totalLectures === 0
            ? 0
            : Math.round(
                (completed / totalLectures) * 100
              );

        students.push({
          _id: student._id,

          name:
            student.firstName +
            " " +
            student.lastName,

          email: student.email,

          image: student.image,

          course: course.courseName,

          progress: progressPercent,

          enrolledDate: course.createdAt,

          status:
            progressPercent === 100
              ? "Completed"
              : "Learning",
        });
      }
    }

    return res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
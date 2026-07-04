const Course = require("../models/Course");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getInstructorAnalytics = async (req, res) => {
  try {

      console.log("Logged In User:", req.user);

    const instructorId = req.user.id;
    const allCourses = await Course.find();


     console.log("ALL COURSES =>");
    allCourses.forEach((c) => {
      console.log({
        courseName: c.courseName,
        instructor: c.instructor.toString(),
      });
    });

    const courses = await Course.find({
      instructor: instructorId,
    });
     console.log("Instructor ID:", instructorId);
    console.log("Courses Found:", courses.length);
    console.log(courses);

    const courseIds = courses.map(
      (course) => course._id
    );

    const orders = await Order.find({
      courses: {
        $in: courseIds,
      },
    });

    let totalRevenue = 0;
    let totalStudents = 0;

    const courseWiseRevenue = [];

    for (const course of courses) {

      const courseOrders = orders.filter(
        (order) =>
          order.courses.some(
            (id) =>
              id.toString() === course._id.toString()
          )
      );

      const revenue = courseOrders.reduce(
        (sum, order) => sum + order.amount,
        0
      );

      totalRevenue += revenue;

      totalStudents +=
        course.studentsEnroled.length;

      courseWiseRevenue.push({
        courseName: course.courseName,
        revenue,
        students:
          course.studentsEnroled.length,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalStudents,
        totalCourses: courses.length,
        courseWiseRevenue,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getAdminRevenueAnalytics = async (req, res) => {
  try {

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalOrders =
      await Order.countDocuments();

    const totalCourses =
      await Course.countDocuments();

    const totalStudents =
      await User.countDocuments({
        accountType: "Student",
      });

    const totalInstructors =
      await User.countDocuments({
        accountType: "Instructor",
      });

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue:
          totalRevenue.length
            ? totalRevenue[0].revenue
            : 0,

        totalOrders,

        totalCourses,

        totalStudents,

        totalInstructors,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
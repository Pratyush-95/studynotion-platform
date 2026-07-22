const { instance } = require("../config/Razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/CourseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/PaymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");


exports.capturePayment = async (req, res) => {
  const { courses, couponCode,} = req.body;
  const userId = req.user.id;
  if (!courses || courses.length === 0) {
    return res.status(400)
    .json({ success: false, message: "Please Provide Course ID" });
  }
  let originalAmount = 0;
  let discountAmount = 0;
  let total_amount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(404)
          .json({ success: false, message: "Could not find the Course" });
      }
     
      if (course.studentsEnroled.some((id) => 
        id.toString() === userId 
      )) {
        return res.status(400)
          .json({ success: false, message: "Student is already Enrolled" });
      }
      total_amount += course.price;
      originalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

   // =====================================
// Apply Coupon (Optional)
// =====================================

if (couponCode) {

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
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
      message: "Coupon usage limit reached",
    });
  }

  if (total_amount < coupon.minimumPurchase) {
    return res.status(400).json({
      success: false,
      message: `Minimum purchase should be ₹${coupon.minimumPurchase}`,
    });
  }

  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {

    discount =
      (total_amount * coupon.discountValue) / 100;

    if (
      coupon.maximumDiscount > 0 &&
      discount > coupon.maximumDiscount
    ) {
      discount = coupon.maximumDiscount;
    }

  } else {

    discount = coupon.discountValue;

  }

  if (discount > total_amount) {
    discount = total_amount;
  }

  discountAmount = discount;

  total_amount -= discount;
}

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };
  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    return res.json({
      success: true,
      data: paymentResponse,
       paymentDetails: {
    originalAmount,
    finalAmount: total_amount,
    discountAmount,
    couponCode: couponCode || "",
  },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;
  const couponCode = req.body?.couponCode;
  const originalAmount = req.body?.originalAmount;
  const discountAmount = req.body?.discountAmount;
  const finalAmount = req.body?.finalAmount;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({ success: false, message: "Payment Failed" });
  }
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  if (expectedSignature === razorpay_signature) {
    // enroll students into courses
    await enrollStudents(courses, userId, res);

    if (res.headersSent) {
      return;
    }

    // compute total amount and persist order record
    try {
      let total_amount = 0
      for (const courseId of courses) {
        const course = await Course.findById(courseId)
        if (course && course.price) total_amount += course.price
      }

      const {
        originalAmount,
        discountAmount,
        couponCode,
        finalAmount,
      } = req.body;

      const order = await Order.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        originalAmount:originalAmount || total_amount,
         discountAmount:discountAmount || 0,
        amount: finalAmount || total_amount,
         couponCode:couponCode || "",
        courses,
        userId,
      })

       console.log("Order saved:", order)
      // =====================================
// Increase Coupon Usage Count
// =====================================

// =====================================
// Increase Coupon Usage Count
// =====================================

if (couponCode) {

  const updatedCoupon = await Coupon.findOneAndUpdate(
    {
      code: couponCode.toUpperCase(),
    },
    {
      $inc: {
        usedCount: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedCoupon) {
    console.log("Coupon not found while updating usage.");
  }
}
   
    } catch (err) {
      console.log("Error saving order:", err)
    }

    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(400).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(200).json({
    success: true,
    message: "Payment success email sent",
});
  } 

  catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please Provide Course ID and User ID",
      });
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { studentsEnroled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }
      console.log("Updated course: ", enrolledCourse);

      let  courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      });

      if (!courseProgress) {
        courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
  }

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);

      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};

exports.getUserOrders = async (req, res) => {
  try {

  const userId = req.user.id
  const orders = await Order.find({ userId })
  .populate({
    path: "courses",
    select:
      "courseName price thumbnail courseContent",
    populate: {
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    },
  })
  .sort({ createdAt: -1 })
    return res.status(200).json({ success: true, data: orders })
  } 

  catch (error) {
    console.log('GET_USER_ORDERS_ERROR', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

// Backfill orders for users who enrolled before orders model existed
exports.backfillMyOrders = async (req, res) => {
  try {
    const userId = req.user.id
    // find enrolled courses on user
    const user = await User.findById(userId).populate('courses').exec()
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (!user.courses || user.courses.length === 0) {
      return res.status(200).json({ success: true, message: 'No enrolled courses to backfill' })
    }

    // check if orders already exist
    const existing = await Order.findOne({ userId })
    if (existing) return res.status(200).json({ success: true, message: 'Orders already exist' })

    let total = 0
    const courseIds = []
    for (const c of user.courses) {
      courseIds.push(c._id)
      if (c.price) total += c.price
    }

    const order = await Order.create({
      orderId: `legacy_${Date.now()}`,
      paymentId: `legacy_${Date.now()}`,
      amount: total,
      courses: courseIds,
      userId,
    })

    return res.status(201).json({ success: true, data: order })
  } catch (error) {
    console.log('BACKFILL_ERROR', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const contactUsRoute = require("./routes/Contact");
const adminRoutes = require("./routes/Admin");
const supportRoutes = require("./routes/Support");
const notificationRoutes = require("./routes/Notification");
const analyticsRoutes = require("./routes/Analytics");
const activityRoutes = require("./routes/Activity");
const couponRoutes = require("./routes/Coupon");
const adminUserRoutes = require("./routes/AdminUserManagement");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/admin-user", adminUserRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome To StudyNotion",
  });
});

module.exports = app;
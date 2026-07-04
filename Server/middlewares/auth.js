const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// ================= AUTH MIDDLEWARE =================
exports.auth = async (req, res, next) => {
  try {
    let token;

    // 🔹 Token extract from multiple places safely
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    else if (req.body && req.body.token) {
      token = req.body.token;
    } 
    else if (req.header("Authorization")) {
      const authHeader = req.header("Authorization");

      // Format: Bearer token
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // console.log("Extracted Token:", token);

    // Token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
        success: false,
        message: "User not found",
      });
  }
      // console.log("Decoded Token:", decoded);

      req.user = decoded;
    } catch (error) {
      console.log("JWT VERIFY ERROR:", error.message);

      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    next();

  } catch (error) {
    console.log("AUTH MIDDLEWARE ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Something Went Wrong While Validating the Token",
    });
  }
};

// ================= ROLE CHECK: STUDENT =================
exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "This is a Protected Route for Students",
      });
    }

    next();
  } catch (error) {
    console.log("isStudent ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "User Role Can't be Verified",
    });
  }
};

// ================= ROLE CHECK: ADMIN =================
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }

    next();
  } catch (error) {
    console.log("isAdmin ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "User Role Can't be Verified",
    });
  }
};

// ================= ROLE CHECK: INSTRUCTOR =================
exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User Role:", userDetails.accountType);

    if (userDetails.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This is a Protected Route for Instructor",
      });
    }

    next();
  } catch (error) {
    console.log("isInstructor ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "User Role Can't be Verified",
    });
  }
};
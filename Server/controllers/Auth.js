const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");
const {
    saveOTP,
    verifyOTP,
    deleteOTP,
    hasOTP,
    getTTL,
} = require("../utils/otpRedis");
const {
  isSecurityEmailSent,
  markSecurityEmailSent,
  clearSecurityEmailFlag,
} = require("../utils/securityEmailLimiter");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const securityAlertTemplate = require("../mail/templates/SecurityAlert");
const emailTemplate = require("../mail/templates/EmailVerification");
const Profile = require("../models/Profile");
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();
const {updateLoginActivity, updateLogoutActivity,}= require("../utils/loginActivity");
const {
  isLocked,
  recordFailedAttempt,
  resetLoginAttempts,
  isIpLocked,
  recordFailedIpAttempt,
  resetIpAttempts,
} = require("../utils/loginRateLimiter");

const googleClient = new OAuth2Client();


// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Check if contact number already in use by another account (normalize digits)
    if (contactNumber) {
    const normalize = (phone) => {
  const digits = (phone || "")
    .toString()
    .replace(/\D/g, "");

  return digits.slice(-10);
};
      const normalizedInput = normalize(contactNumber);

      const otherProfiles = await Profile.find({ contactNumber: { $exists: true, $ne: null, $ne: "" } });
      const conflict = otherProfiles.find((p) => normalize(p.contactNumber) === normalizedInput);
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered with another account",
        });
      }
    }

    const isMatch = await verifyOTP(email, otp);

if (!isMatch) {
  return res.status(400).json({
    success: false,
    message: "Invalid or Expired OTP",
  });
}

console.log("OTP Match Success");
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password Hashed",hashedPassword);
    
    // Create profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || undefined,
    });

    console.log("Profile Created");
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType : accountType || "Student",
      approved: accountType === "Instructor" ? false : true,
      approvalStatus:  accountType === "Instructor" ? "Pending" : "Approved",
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}%20${lastName}`,
    });
    console.log("User Created");

    // Delete OTP after success
    await deleteOTP(email);

    return res.status(200).json({
      success: true,
      user,
      message: "Signup successful",
    });

  } catch (error) {
      console.error("SIGNUP ERROR => ", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};



// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress || req.ip;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered with Us Please Sign Up to Continue",
      });
    }


    // ======================================================
// Check if Account is Locked
// ======================================================

const lockStatus = await isLocked(email);

if (lockStatus.locked) {

  const minutes = Math.floor(lockStatus.ttl / 60);
  const seconds = lockStatus.ttl % 60;

  let timeLeft = "";

  if (minutes > 0) {
    timeLeft += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  if (seconds > 0) {
    if (timeLeft) {
      timeLeft += " ";
    }

    timeLeft += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return res.status(429).json({
    success: false,
    message: `Too many failed login attempts. Try again after ${timeLeft}.`,
  });

}


const ipLockStatus = await isIpLocked(ip);

if (ipLockStatus.locked) {
  const minutes = Math.floor(ipLockStatus.ttl / 60);
  const seconds = ipLockStatus.ttl % 60;

  let timeLeft = "";

  if (minutes > 0) {
    timeLeft += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  if (seconds > 0) {
    if (timeLeft) timeLeft += " ";
    timeLeft += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return res.status(429).json({
    success: false,
    message: `Too many failed login attempts from this IP Address. Try again after ${timeLeft}.`,
  });

}

    // Compare password
    if (await bcrypt.compare(password, user.password)) {

      // ======================================================
// Check User Active Status
// ======================================================

if (!user.active) {

  return res.status(403).json({
    success: false,
    message:
      "Your account has been deactivated by the administrator. Please contact support.",
  });

}

  await resetLoginAttempts(email);
  await resetIpAttempts(ip);
  await clearSecurityEmailFlag(email);
  await updateLoginActivity(user, req);

    // Generate Tokens
const accessToken = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);

// Save Refresh Token in Database
user.refreshToken = refreshToken;
await user.save();

// Optional (abhi compatibility ke liye)
user.token = accessToken;

user.password = undefined;

// Access Token Cookie
res.cookie("token", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 Minutes
});

// Refresh Token Cookie
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
});

return res.status(200).json({
  success: true,
  token: accessToken,
  user,
  message: "Login successful",
});

  } else {

  const attempts = await recordFailedAttempt(email);
  const ipAttempts = await recordFailedIpAttempt(ip);

  // 10th attempt → Account Locked
  if (attempts >= 10 || ipAttempts >= 10) {

   try {

  const alreadySent = await isSecurityEmailSent(email);

  if (!alreadySent) {

    await mailSender(
      email,
      "StudyNotion Security Alert",
      securityAlertTemplate(
        email,
        ip,
        new Date().toLocaleString(),
        "10 minutes"
      )
    );

    await markSecurityEmailSent(email);

  }

} catch (error) {

  console.error("Failed to send security alert email:", error.message);

}

    return res.status(429).json({
      success: false,
      message:
        "Too many failed login attempts. Your account has been locked for 10 minutes.",
    });

  }

  // Warning after 6th attempt
  if (attempts >= 6) {

    return res.status(401).json({
      success: false,
      message: `Invalid password. Warning: ${attempts}/10 failed attempts.`,
    });

  }
  return res.status(401).json({
    success: false,
    message: "Invalid password",
  });

}

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


// ================= SEND OTP =================
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
   //  console.log("STEP 1", email);

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // / Prevent spam OTP (1 min wait)
    const otpExists = await hasOTP(email);
    if (otpExists) {
       const ttl = await getTTL(email);

    return res.status(400).json({
    success: false,
    message: `Please wait ${ttl} seconds before requesting another OTP`,
  });

}


    // Generate numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Generated OTP:", otp);

    await saveOTP(email, otp);
    console.log("STEP 4 OTP SAVED IN REDIS");

    // 📩 Send email (IMPORTANT)
    await mailSender(email, "Verification Email", emailTemplate(otp));
      console.log("STEP 7 EMAIL SENT");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// ================= CHANGE PASSWORD =================
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);

    if (!userDetails) {
      return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
}

    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password update failed",
    });
  }
};


// ================= GOOGLE SIGN IN/UP =================
exports.googleAuth = async (req, res) => {
  try {
    const { idToken, accountType } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'ID token required' });
    }

      const decoded = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64").toString()
    );

    // console.log("TOKEN AUD =", decoded.aud);
    // console.log("EXPECTED AUD =", process.env.GOOGLE_CLIENT_ID);

    // Verify token with Google. Some tokens are issued for the Firebase web client id
    // while others use a separate Google OAuth client id. Try the primary client id
    // first, and fall back to `FIREBASE_CLIENT_ID` if verification fails.
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({ idToken});

      //  console.log("VERIFY SUCCESS");
    } 
    
    
    catch (err) {
       console.log("FULL VERIFY ERROR:");
      console.warn('verifyIdToken failed with primary GOOGLE_CLIENT_ID:', err.message);
      if (process.env.FIREBASE_CLIENT_ID) {
        try {
          ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.FIREBASE_CLIENT_ID });
        } catch (err2) {
          console.error('verifyIdToken also failed with FIREBASE_CLIENT_ID:', err2.message);
          throw err2; // rethrow to outer catch
        }
      } else {
        throw err; // rethrow to outer catch
      }
    }
    const payload = ticket.getPayload();
    // console.log('Google token payload aud:', payload.aud);

    const email = payload.email;
    const firstName = payload.given_name || payload.name?.split(' ')[0] || 'User';
    const lastName = payload.family_name || payload.name?.split(' ').slice(1).join(' ') || 'User';
    const picture = payload.picture;

    const ip =
  req.headers["x-forwarded-for"]?.split(",")[0] ||
  req.socket.remoteAddress ||
  req.ip;

    // Find existing user
    let user = await User.findOne({ email }).populate('additionalDetails');

    // Check Account Lock
  // Check Account Lock
const lockStatus = await isLocked(email);

if (lockStatus.locked) {

  const minutes = Math.floor(lockStatus.ttl / 60);
  const seconds = lockStatus.ttl % 60;

  let timeLeft = "";

  if (minutes > 0) {
    timeLeft += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  if (seconds > 0) {
    if (timeLeft) timeLeft += " ";
    timeLeft += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return res.status(429).json({
    success: false,
    message: `Your account is temporarily locked. Please try again after ${timeLeft}.`,
  });

}

// Check IP Lock
 const ipLockStatus = await isIpLocked(ip);

if (ipLockStatus.locked) {

  const minutes = Math.floor(ipLockStatus.ttl / 60);
  const seconds = ipLockStatus.ttl % 60;

  let timeLeft = "";

  if (minutes > 0) {
    timeLeft += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  if (seconds > 0) {
    if (timeLeft) timeLeft += " ";
    timeLeft += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return res.status(429).json({
    success: false,
    message: `This IP address is temporarily blocked due to multiple failed login attempts. Please try again after ${timeLeft}.`,
  });

}
    // ======================================================
// Check User Active Status
// ======================================================

if (user && !user.active) {

  return res.status(403).json({
    success: false,
    message:
      "Your account has been deactivated by the administrator. Please contact support.",
  });

}

    if (!user) {
      // Create profile
      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
      });

      // Create new user with a random password (hashed) to satisfy schema
      const randomPassword =
          Math.random().toString(36).slice(-10) +
          Date.now().toString();

      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType: accountType || 'Student',
        approved : accountType === "Instructor" ? false : true,
        approvalStatus: accountType === "Instructor" ? "Pending" : "Approved",
        additionalDetails: profileDetails._id,
        image: picture || `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}%20${lastName}`,
      });
    }

    await resetLoginAttempts(email);
    await resetIpAttempts(ip);
    await clearSecurityEmailFlag(email);
    await updateLoginActivity(user, req);

    // Generate Tokens
const accessToken = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);

// Save Refresh Token
user.refreshToken = refreshToken;
user.token = accessToken;

await user.save();
user.password = undefined;

// Access Token Cookie
res.cookie("token", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
});

// Refresh Token Cookie
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

return res.status(200).json({
  success: true,
  token: accessToken,
  user,
  message: "Google authentication successful",
});

  } catch (error) {
    console.error('Google Auth Error', error);
    // Return the underlying error message when possible to aid debugging in development.
    const message = error?.message || 'Google authentication failed';
    // Some google auth errors include details in error.errors or error.details — include them when available.
    const details = error?.errors || error?.details || null;
    return res.status(400).json({ success: false, message, details });
  }
}


exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token Missing",
      });
    }

    // Verify Refresh Token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // User Check
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Database Token Match
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    // Generate New Access Token
    const accessToken = generateAccessToken(user);

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token: accessToken,
      message: "Access Token Refreshed",
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Refresh Token Expired",
    });

  }
};



// ======================================================
// Logout
// ======================================================

exports.logout = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (user) {

      await updateLogoutActivity(user);

      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});


    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({

      success: true,

      message: "Logged out successfully.",

    });

  }

  catch (error) {

    console.log("LOGOUT_ERROR", error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
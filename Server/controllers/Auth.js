const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/EmailVerification");
const Profile = require("../models/Profile");
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();
const {updateLoginActivity, updateLogoutActivity,}= require("../utils/loginActivity");

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

    // Get latest OTP
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

      if (!recentOtp.length) {
          return res.status(400).json({
          success: false,
          message: "OTP expired",
      });
}

    if (recentOtp[0].createdAt.getTime() < Date.now() - 5*60*1000) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, recentOtp[0].otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
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
    await OTP.deleteMany({ email });

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

  await updateLoginActivity(user, req);

      const token = jwt.sign(
        { email: user.email, id: user._id, accountType : user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      user.token = token;
      user.password = undefined;

      res.cookie("token", token, {
        httpOnly: true,
        secure : process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge : 24*60*60*1000
      })

      return res.status(200).json({
        success: true,
        token,
        user,
        message: "Login successful",
      });

    } else {
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
     console.log("STEP 1", email);

    // Check if user exists
    const user = await User.findOne({ email });
     console.log("STEP 2");
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // / Prevent spam OTP (1 min wait)
    const recentOtp = await OTP.findOne({email}).sort({createdAt : -1});
    console.log("STEP 3");

    if (recentOtp && Date.now() - recentOtp.createdAt.getTime() < 60 * 1000) {
        return res.status(400).json({
        success: false,
        message: "Please wait before requesting another OTP",
    });

    
}


    // Generate numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Generated OTP:", otp);

    // 🔐 Hash OTP
    const hashedOTP = await bcrypt.hash(otp, 10);
     console.log("STEP 4");
    // Delete old OTPs
    await OTP.deleteMany({ email });
     console.log("STEP 5");


    // Save hashed OTP
    await OTP.create({ email, otp: hashedOTP });
    console.log("STEP 6 OTP SAVED");

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

    // Find existing user
    let user = await User.findOne({ email }).populate('additionalDetails');
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

    await updateLoginActivity(user, req);

    // Create JWT
    const token = jwt.sign({ email: user.email, id: user._id, accountType: user.accountType }, process.env.JWT_SECRET, { expiresIn: '24h' });

    user.token = token;
    user.password = undefined;

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 24*60*60*1000 });

    return res.status(200).json({ success: true, token, user, message: 'Google authentication successful' });

  } catch (error) {
    console.error('Google Auth Error', error);
    // Return the underlying error message when possible to aid debugging in development.
    const message = error?.message || 'Google authentication failed';
    // Some google auth errors include details in error.errors or error.details — include them when available.
    const details = error?.errors || error?.details || null;
    return res.status(400).json({ success: false, message, details });
  }
}



// ======================================================
// Logout
// ======================================================

exports.logout = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (user) {

      await updateLogoutActivity(user);

    }

    res.clearCookie("token", {
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
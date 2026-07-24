const bcrypt = require("bcrypt");
const { redisClient } = require("../config/redis");

const OTP_EXPIRY = 5 * 60; // 5 Minutes

// Save OTP
exports.saveOTP = async (email, otp) => {

    const hashedOTP = await bcrypt.hash(otp, 10);

    await redisClient.setEx(
        `otp:${email}`,
        OTP_EXPIRY,
        hashedOTP
    );
};

// Verify OTP
exports.verifyOTP = async (email, otp) => {

    const storedOTP = await redisClient.get(`otp:${email}`);

    if (!storedOTP) {
        return false;
    }

    return await bcrypt.compare(
        otp,
        storedOTP
    );
};

// Delete OTP
exports.deleteOTP = async (email) => {

    await redisClient.del(`otp:${email}`);

};

// Check Existing OTP
exports.hasOTP = async (email) => {

    return await redisClient.exists(
        `otp:${email}`
    );

};

// Remaining Time 
exports.getTTL = async (email) => {

    return await redisClient.ttl(
        `otp:${email}`
    );

};
const mongoose = require("mongoose");



const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

// async function sendVerificationEmail(email, otp) {

//   try {
//     await mailSender(email, "Verification Email", emailTemplate(otp));
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// ✅ FIXED
//OTPSchema.pre("save", async function () {
 // if (this.isNew) {
   // await sendVerificationEmail(this.email, this.otp);
  //}
//});

module.exports = mongoose.model("OTP", OTPSchema);
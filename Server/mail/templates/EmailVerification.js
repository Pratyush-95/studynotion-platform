module.exports = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>StudyNotion Verification</title>
  </head>

  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f4f4f4;">
    
    <!-- 🔥 PREHEADER (EMAIL PREVIEW TEXT) -->
    <div style="display:none; max-height:0px; overflow:hidden;">
      🔐 Verify your StudyNotion account using this secure OTP. Valid for 5 minutes.
    </div>

    <div style="max-width:600px; margin:20px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.1);">

      <!-- 🔥 HEADER -->
      <div style="background: linear-gradient(90deg,#2563eb,#06b6d4); padding:25px; text-align:center;">
        
        <!-- ✅ BLACK LOGO -->
        <img 
          src="https://res.cloudinary.com/ddi03cdty/image/upload/v1774160823/geaejbovn79lpszfnvvs.png" 
          alt="StudyNotion Logo"
          style="width:130px; filter: brightness(0); margin-bottom:10px;"
        />

        <h1 style="color:white; margin:5px 0;">
          StudyNotion
        </h1>

        <p style="color:#e0f2fe; margin:0;">
          Learning Made Easy 🚀
        </p>

      </div>

      <!-- 📩 BODY -->
      <div style="padding:30px;">
        
        <!-- ✅ HEADING -->
        <h2 style="color:#111827; margin-top:0;">
          Email Verification Required 🔐
        </h2>

        <p style="color:#374151; font-size:15px;">
          Dear User,
        </p>

        <p style="color:#374151; line-height:1.6;">
          We received a request to verify your email for your <b>StudyNotion</b> account.  
          Please use the One-Time Password (OTP) below to complete your verification process.
        </p>

        <!-- 🔢 OTP BOX -->
        <div style="text-align:center; margin:30px 0;">
          <div style="
            display:inline-block;
            background:#f1f5f9;
            padding:18px 28px;
            border-radius:8px;
            font-size:30px;
            letter-spacing:6px;
            font-weight:bold;
            color:#1e3a8a;
            border-left:5px solid #2563eb;
          ">
            ${otp}
          </div>
        </div>

        <p style="color:#374151;">
          ⏳ This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
        </p>

        <!-- 🔥 EXTRA PROFESSIONAL BOX -->
        <div style="background:#f9fafb; padding:15px; border-radius:8px; margin-top:20px;">
          <p style="margin:0; font-size:14px; color:#6b7280;">
            ⚠️ For your security, always ensure you are on the official StudyNotion platform before entering your OTP.
          </p>
        </div>

        <p style="color:#6b7280; margin-top:20px;">
          If you did not request this verification, you can safely ignore this email.
        </p>

        <!-- ✅ CONTACT -->
        <p style="color:#374151; margin-top:20px;">
          Need help? Reach out to us at:  
          <b>studynotion.auth@gmail.com</b>
        </p>

      </div>

      <!-- ⚡ FOOTER -->
      <div style="background:#f3f4f6; text-align:center; padding:15px; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} StudyNotion. All rights reserved.
      </div>

    </div>

  </body>
  </html>
  `;
};
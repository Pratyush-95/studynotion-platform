exports.contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {

  const sanitize = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const safeFirst = sanitize(firstname);
  const safeLast = sanitize(lastname);
  const safeEmail = sanitize(email);
  const safeMessage = sanitize(message);
  const safePhone = sanitize(phoneNo);
  const safeCode = sanitize(countrycode);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Contact Form Confirmation</title>
  </head>

  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

    <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <!-- 🔥 BLACK HEADER -->
      <div style="background: linear-gradient(90deg,#000000,#1f2937,#111827); padding:25px; text-align:center;">
        
        <!-- ✅ LOGO -->
        <img 
          src="https://res.cloudinary.com/ddi03cdty/image/upload/v1774160823/geaejbovn79lpszfnvvs.png" 
          alt="StudyNotion Logo"
          style="width:130px; filter: brightness(0); margin-bottom:10px;"
        />

        <h1 style="color:white; margin:5px 0;">
          StudyNotion
        </h1>

        <p style="color:#d1d5db; margin:0;">
          Learning Made Easy 🚀
        </p>

      </div>

      <!-- 📩 BODY -->
      <div style="padding:25px; text-align:center;">

        <h2 style="color:#111827;">Contact Form Confirmation</h2>

        <p>Dear <strong>${safeFirst} ${safeLast}</strong>,</p>

        <p style="color:#4b5563;">
          Thank you for contacting us. We have received your message and will respond as soon as possible.
        </p>

        <!-- DETAILS BOX -->
        <div style="text-align:left;margin-top:20px;background:#f9fafb;padding:15px;border-radius:8px;">
          <p><strong>Name:</strong> ${safeFirst} ${safeLast}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> +${safeCode} ${safePhone}</p>
          <p><strong>Message:</strong> ${safeMessage}</p>
        </div>

        <!-- ✅ BUTTON -->
        <a href="https://studynotion-edtech-project.vercel.app"
           style="display:inline-block;margin-top:20px;padding:12px 25px;background:#FFD60A;color:#000;text-decoration:none;border-radius:6px;font-weight:bold;">
           Visit Website
        </a>

        <!-- SUPPORT -->
        <p style="margin-top:20px;font-size:13px;color:#6b7280;">
          Need help? Contact us at 
          <a href="mailto:studynotion.auth@gmail.com">studynotion.auth@gmail.com</a>
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background:#f3f4f6;text-align:center;padding:12px;font-size:12px;color:#6b7280;">
        © ${new Date().getFullYear()} StudyNotion. All rights reserved.
      </div>

    </div>

  </body>
  </html>
  `;
};
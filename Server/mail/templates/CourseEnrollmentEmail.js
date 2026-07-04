
exports.courseEnrollmentEmail = (courseName, name) => {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Course Enrollment Successful</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fc;
      font-family: Arial, Helvetica, sans-serif;
      color: #333;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
    }

    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      padding: 30px;
      text-align: center;
    }

    .logo {
      width: 180px;
      margin-bottom: 10px;
    }

    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 26px;
    }

    .content {
      padding: 35px;
      text-align: left;
    }

    .content h2 {
      margin-top: 0;
      color: #1e293b;
    }

    .course-box {
      background: #eff6ff;
      border-left: 5px solid #2563eb;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .course-name {
      font-size: 18px;
      font-weight: bold;
      color: #1e40af;
    }

    .content p {
      line-height: 1.7;
      margin-bottom: 15px;
    }

    .btn-container {
      text-align: center;
      margin: 30px 0;
    }

    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
    }

    .footer {
      background: #f8fafc;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }

    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>

<body>

  <div class="wrapper">
    <div class="container">

      <div class="header">
         <img 
          src="https://res.cloudinary.com/ddi03cdty/image/upload/v1774160823/geaejbovn79lpszfnvvs.png" 
          alt="StudyNotion Logo"
          style="width:130px; filter: brightness(0); margin-bottom:10px;"
        />

        <h1>Enrollment Confirmed</h1>
      </div>

      <div class="content">

        <h2>Hello ${name},</h2>

        <p>
          Congratulations! Your enrollment has been successfully completed.
          We are excited to have you as a learner on StudyNotion.
        </p>

        <div class="course-box">
          <div>Enrolled Course</div>
          <div class="course-name">${courseName}</div>
        </div>

        <p>
          You can now access all course materials, lectures, assignments,
          and learning resources directly from your dashboard.
        </p>

        <p>
          Stay consistent, complete your lessons, and make the most of your
          learning journey.
        </p>

        <div class="btn-container">
          <a
            href="http://localhost:5173/dashboard/my-profile"
            class="btn"
          >
            Go to Dashboard →
          </a>
        </div>

        <p>
          We wish you success in your learning journey.
        </p>

        <p>
          Best Regards,<br />
          <strong>StudyNotion Team</strong>
        </p>

      </div>

      <div class="footer">
        Need help? Contact us at
        <a href="mailto:studynotion.auth@gmail.com">
          studynotion.auth@gmail.com
        </a>

        <br /><br />

        © 2026 StudyNotion. All Rights Reserved.
      </div>

    </div>
  </div>

</body>

</html>
`;
};


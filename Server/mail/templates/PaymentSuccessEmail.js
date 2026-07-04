
exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Payment Successful</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fc;
      font-family: Arial, Helvetica, sans-serif;
      color: #333;
    }

    .wrapper {
      padding: 40px 0;
    }

    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    }

    .header {
      background: linear-gradient(135deg, #16a34a, #15803d);
      padding: 30px;
      text-align: center;
    }

    .logo {
      width: 180px;
      margin-bottom: 12px;
    }

    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
    }

    .content {
      padding: 35px;
    }

    .content h2 {
      color: #1e293b;
      margin-top: 0;
    }

    .success-box {
      background: #f0fdf4;
      border-left: 5px solid #16a34a;
      padding: 18px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
    }

    .amount {
      font-size: 30px;
      font-weight: bold;
      color: #16a34a;
    }

    .details {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .details td {
      padding: 14px;
      border-bottom: 1px solid #e2e8f0;
    }

    .details td:first-child {
      font-weight: bold;
      color: #475569;
      width: 40%;
    }

    .details td:last-child {
      color: #0f172a;
      word-break: break-word;
    }

    .btn-container {
      text-align: center;
      margin-top: 30px;
    }

    .btn {
      display: inline-block;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: bold;
    }

    .footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
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

        <h1>✅ Payment Successful</h1>
      </div>

      <div class="content">

        <h2>Hello ${name},</h2>

        <p>
          Thank you for your purchase. Your payment has been successfully
          processed and your enrollment has been confirmed.
        </p>

        <div class="success-box">
          <p style="margin:0;">Amount Paid</p>
          <div class="amount">₹${amount}</div>
        </div>

        <table class="details">
          <tr>
            <td>Order ID</td>
            <td>${orderId}</td>
          </tr>

          <tr>
            <td>Payment ID</td>
            <td>${paymentId}</td>
          </tr>

          <tr>
            <td>Payment Status</td>
            <td>Successful</td>
          </tr>
        </table>

        <p style="margin-top:25px;">
          You can now access your purchased courses and begin your learning journey.
        </p>

        <div class="btn-container">
          <a
            href="https://studynotion-edtech-project.vercel.app/dashboard/my-profile"
            class="btn"
          >
            Go To Dashboard →
          </a>
        </div>

        <p style="margin-top:30px;">
          Thank you for choosing StudyNotion. We wish you a successful learning experience.
        </p>

        <p>
          Best Regards,<br/>
          <strong>StudyNotion Team</strong>
        </p>

      </div>

      <div class="footer">
        Need assistance? Contact us at
        <a href="mailto:studynotion.auth@gmail.com">
          studynotion.auth@gmail.com
        </a>

        <br/><br/>

        © 2026 StudyNotion. All Rights Reserved.
      </div>

    </div>
  </div>

</body>
</html>
`;
};


const securityAlertTemplate = (
  email,
  ip,
  time,
  lockDuration = "10 minutes"
) => {
  return `
  <!DOCTYPE html>
  <html>

  <head>
      <meta charset="UTF-8" />
      <title>Security Alert</title>
  </head>

  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px;">

          <h2 style="color:#d32f2f;">
              🚨 Security Alert
          </h2>

          <p>Hello,</p>

          <p>
              We detected multiple failed login attempts on your
              <strong>StudyNotion</strong> account.
          </p>

          <p>
              Your account has been temporarily locked for
              <strong>${lockDuration}</strong>.
          </p>

          <hr>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>IP Address:</strong> ${ip}</p>

          <p><strong>Time:</strong> ${time}</p>

          <hr>

          <p>
              If this was you, simply wait until the lock expires.
          </p>

          <p>
              If this wasn't you, we strongly recommend changing your password
              immediately.
          </p>

          <br>

          <p>
              Regards,<br>
              StudyNotion Security Team
          </p>

      </div>
  </body>

  </html>
  `;
};

module.exports = securityAlertTemplate;

exports.accountDeletionCancelledEmail = (name) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Account Deletion Cancelled</title>
  </head>

  <body style="
      margin:0;
      padding:0;
      background-color:#f4f6f8;
      font-family:Arial, Helvetica, sans-serif;
      color:#333333;
  ">

      <div style="
          max-width:650px;
          margin:40px auto;
          background:#ffffff;
          border-radius:12px;
          overflow:hidden;
          box-shadow:0 4px 12px rgba(0,0,0,0.08);
      ">

          
          <div style="
              background:#161D29;
              padding:30px;
              text-align:center;
          ">
              <h1 style="
                  margin:0;
                  color:#FFD60A;
              ">
                  StudyNotion
              </h1>

              <p style="
                  color:#ffffff;
                  margin-top:10px;
              ">
                  Account Deletion Cancelled
              </p>
          </div>

         
          <div style="padding:40px;">

              <p>Hello <strong>${name}</strong>,</p>

              <p style="line-height:1.8;">
                  Your account deletion request has been successfully cancelled.
              </p>

              <div style="
                  background:#ECFDF3;
                  border-left:5px solid #22C55E;
                  padding:18px;
                  border-radius:8px;
                  margin:25px 0;
              ">
                  <strong>Good News!</strong><br>
                  Your StudyNotion account remains active and all your
                  profile information, enrolled courses, learning progress,
                  and related data have been preserved.
              </div>

              <p style="line-height:1.8;">
                  No further action is required. You can continue learning
                  and using StudyNotion as usual.
              </p>

              <p style="margin-top:35px;">
                  Best Regards,
                  <strong>StudyNotion Team</strong>
              </p>

          </div>

          <div style="
              background:#F8F9FA;
              padding:20px;
              text-align:center;
              border-top:1px solid #E5E7EB;
          ">
              <p style="
                  margin:0;
                  color:#6B7280;
                  font-size:13px;
              ">
                  © StudyNotion. All Rights Reserved.
              </p>
          </div>

      </div>

  </body>
  </html>
  `;
};


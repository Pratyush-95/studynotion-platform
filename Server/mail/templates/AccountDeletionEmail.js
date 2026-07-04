
exports.accountDeletionEmail = (name, deleteDate, userId) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Account Deletion Scheduled</title>
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

          <!-- Header -->
          <div style="
              background:#161D29;
              padding:30px;
              text-align:center;
          ">
              <h1 style="
                  margin:0;
                  color:#FFD60A;
                  font-size:28px;
              ">
                  StudyNotion
              </h1>

              <p style="
                  color:#ffffff;
                  margin-top:10px;
                  font-size:15px;
              ">
                  Account Deletion Request Received
              </p>
          </div>

          <!-- Content -->
          <div style="padding:40px;">

              <p style="font-size:16px;">
                  Hello <strong>${name}</strong>,
              </p>

              <p style="font-size:15px; line-height:1.8;">
                  We have received a request to delete your StudyNotion account.
                  Your account has been scheduled for deletion and will remain
                  recoverable until the date shown below.
              </p>

              <!-- Deletion Date Box -->
              <div style="
                  background:#FFF9E5;
                  border-left:5px solid #FFD60A;
                  padding:18px;
                  margin:25px 0;
                  border-radius:8px;
              ">
                  <p style="
                      margin:0;
                      font-size:15px;
                  ">
                      <strong>Scheduled Deletion Date:</strong>
                  </p>

                  <p style="
                      margin-top:8px;
                      font-size:18px;
                      color:#161D29;
                      font-weight:bold;
                  ">
                      ${deleteDate.toDateString()}
                  </p>
              </div>

              <p style="font-size:15px; line-height:1.8;">
                  If this deletion request was made accidentally or you have changed
                  your mind, you can cancel the request anytime before the scheduled
                  deletion date.
              </p>

              <!-- Button -->
              <div style="
                  text-align:center;
                  margin:35px 0;
              ">
                  <a
                      href="http://localhost:5173/manage-deletion/${userId}"
                      style="
                          background:#FFD60A;
                          color:#000000;
                          text-decoration:none;
                          padding:14px 30px;
                          border-radius:8px;
                          font-size:16px;
                          font-weight:bold;
                          display:inline-block;
                      "
                  >
                      Manage Deletion Request
                  </a>
              </div>

              <!-- Warning Box -->
              <div style="
                  background:#FFF5F5;
                  border:1px solid #FFD6D6;
                  padding:18px;
                  border-radius:8px;
                  margin-top:20px;
              ">
                  <p style="
                      margin:0;
                      font-size:15px;
                      line-height:1.8;
                  ">
                      <strong>Important:</strong><br>
                      Once the deletion date passes, your account and all associated
                      data including profile information, enrolled courses,
                      course progress, certificates, and learning history
                      will be permanently removed and cannot be recovered.
                  </p>
              </div>

              <p style="
                  margin-top:30px;
                  font-size:15px;
                  line-height:1.8;
              ">
                  If no action is taken before the scheduled date,
                  the deletion process will be completed automatically.
              </p>

              <p style="margin-top:35px;">
                  Best Regards,<br>
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


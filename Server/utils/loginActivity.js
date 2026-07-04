// ======================================================
// Get Browser Name
// ======================================================

const getBrowserName = (userAgent = "") => {

  if (userAgent.includes("Edg")) return "Edge";

  if (userAgent.includes("Chrome")) return "Chrome";

  if (userAgent.includes("Firefox")) return "Firefox";

  if (userAgent.includes("Safari")) return "Safari";

  if (userAgent.includes("Opera")) return "Opera";

  return "Unknown";

};

// ======================================================
// Get Client IP Address
// ======================================================

const getIpAddress = (req) => {

  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket.remoteAddress || "";

};

// ======================================================
// Update Login Activity
// ======================================================

const updateLoginActivity = async (user, req) => {

  user.lastLogin = new Date();

  user.browser = getBrowserName(
    req.headers["user-agent"]
  );

  user.ipAddress = getIpAddress(req);

  await user.save();

};




// ======================================================
// Update Logout Activity
// ======================================================

const updateLogoutActivity = async (user) => {

  user.lastLogout = new Date();

  await user.save();

};

module.exports = {
  updateLoginActivity,
  updateLogoutActivity,
};
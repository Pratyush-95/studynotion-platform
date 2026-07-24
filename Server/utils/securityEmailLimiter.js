const { redisClient } = require("../config/redis");

// Key
const getSecurityEmailKey = (email) =>
  `security:email:${email}`;

exports.isSecurityEmailSent = async (email) => {
  const exists = await redisClient.exists(getSecurityEmailKey(email));
  return exists === 1;
};

exports.markSecurityEmailSent = async (email, ttl = 600) => {
  await redisClient.setEx(
    getSecurityEmailKey(email),
    ttl,
    "SENT"
  );
};

exports.clearSecurityEmailFlag = async (email) => {
  await redisClient.del(getSecurityEmailKey(email));
};
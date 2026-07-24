const { redisClient } = require("../config/redis");

const MAX_ATTEMPTS = 10;
const LOCK_TIME = 10 * 60; // 10 Minutes

// Keys
const getAttemptsKey = (email) => `login:attempts:${email}`;
const getLockKey = (email) => `login:lock:${email}`;

// IP Keys
const getIpAttemptsKey = (ip) => `login:attempts:ip:${ip}`;
const getIpLockKey = (ip) => `login:lock:ip:${ip}`;

// Check if account is locked
exports.isLocked = async (email) => {
  const ttl = await redisClient.ttl(getLockKey(email));

  if (ttl > 0) {
    return {
      locked: true,
      ttl,
    };
  }

  return {
    locked: false,
    ttl: 0,
  };
};

// Record failed login
exports.recordFailedAttempt = async (email) => {
  const attemptsKey = getAttemptsKey(email);

  const attempts = await redisClient.incr(attemptsKey);

  // Counter expires after 10 minutes
  if (attempts === 1) {
    await redisClient.expire(attemptsKey, LOCK_TIME);
  }

  // Lock account
  if (attempts >= MAX_ATTEMPTS) {
    await redisClient.setEx(getLockKey(email), LOCK_TIME, "LOCKED");
  }

  return attempts;
};

// Reset on successful login
exports.resetLoginAttempts = async (email) => {
  await redisClient.del(getAttemptsKey(email));
  await redisClient.del(getLockKey(email));
};


// =======================================
// Check IP Lock
// =======================================

exports.isIpLocked = async (ip) => {

  const ttl = await redisClient.ttl(getIpLockKey(ip));

  if (ttl > 0) {
    return {
      locked: true,
      ttl,
    };
  }

  return {
    locked: false,
    ttl: 0,
  };

};

// =======================================
// Record Failed IP Attempt
// =======================================

exports.recordFailedIpAttempt = async (ip) => {

  const key = getIpAttemptsKey(ip);

  const attempts = await redisClient.incr(key);

  if (attempts === 1) {
    await redisClient.expire(key, LOCK_TIME);
  }

  if (attempts >= MAX_ATTEMPTS) {
    await redisClient.setEx(
      getIpLockKey(ip),
      LOCK_TIME,
      "LOCKED"
    );
  }

  return attempts;

};

// =======================================
// Reset IP Counter
// =======================================

exports.resetIpAttempts = async (ip) => {

  await redisClient.del(getIpAttemptsKey(ip));
  await redisClient.del(getIpLockKey(ip));

};
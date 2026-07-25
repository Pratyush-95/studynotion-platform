const { redisClient } = require("../config/redis");

// =========================
// Redis Keys
// =========================

const getCooldownKey = (email) => `reset:cooldown:${email}`;
const getHourlyKey = (email) => `reset:hourly:${email}`;
const getDailyKey = (email) => `reset:daily:${email}`;
const getIpKey = (ip) => `reset:ip:${ip}`;

// =========================
// Cooldown
// =========================

exports.checkResetCooldown = async (email) => {
  const ttl = await redisClient.ttl(getCooldownKey(email));

  if (ttl > 0) {
    return {
      blocked: true,
      ttl,
    };
  }

  return {
    blocked: false,
    ttl: 0,
  };
};

// =========================
// Hourly Limit
// =========================

exports.checkHourlyLimit = async (email) => {
  const count = Number(await redisClient.get(getHourlyKey(email))) || 0;

  if (count >= 5) {
    const ttl = await redisClient.ttl(getHourlyKey(email));

    return {
      blocked: true,
      ttl,
    };
  }

  return {
    blocked: false,
    ttl: 0,
  };
};

// =========================
// Daily Limit
// =========================

exports.checkDailyLimit = async (email) => {
  const count = Number(await redisClient.get(getDailyKey(email))) || 0;

  if (count >= 10) {
    const ttl = await redisClient.ttl(getDailyKey(email));

    return {
      blocked: true,
      ttl,
    };
  }

  return {
    blocked: false,
    ttl: 0,
  };
};

// =========================
// IP Limit
// =========================

exports.checkIpLimit = async (ip) => {
  const count = Number(await redisClient.get(getIpKey(ip))) || 0;

  if (count >= 20) {
    const ttl = await redisClient.ttl(getIpKey(ip));

    return {
      blocked: true,
      ttl,
    };
  }

  return {
    blocked: false,
    ttl: 0,
  };
};

// =========================
// Increment Counters
// =========================

exports.incrementResetRequests = async (email) => {

  await redisClient.setEx(getCooldownKey(email), 60, "1");

  const hourly = await redisClient.incr(getHourlyKey(email));

  if (hourly === 1) {
    await redisClient.expire(getHourlyKey(email), 3600);
  }

  const daily = await redisClient.incr(getDailyKey(email));

  if (daily === 1) {
    await redisClient.expire(getDailyKey(email), 86400);
  }
};

// =========================
// Increment IP
// =========================

exports.incrementIpRequests = async (ip) => {

  const count = await redisClient.incr(getIpKey(ip));

  if (count === 1) {
    await redisClient.expire(getIpKey(ip), 3600);
  }

};
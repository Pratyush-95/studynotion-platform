const { redisClient } = require("../config/redis");

// ---------- Redis Keys ----------
const getCooldownKey = (email) => `otp:cooldown:${email}`;
const getHourlyKey = (email) => `otp:hour:${email}`;
const getDailyKey = (email) => `otp:day:${email}`;

// ---------- Check Cooldown ----------
exports.checkOtpCooldown = async (email) => {
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

// ---------- Increment OTP Count ----------
exports.incrementOtpRequests = async (email) => {
  // Hourly Counter
  const hourlyCount = await redisClient.incr(getHourlyKey(email));

  if (hourlyCount === 1) {
    await redisClient.expire(getHourlyKey(email), 3600);
  }

  // Daily Counter
  const dailyCount = await redisClient.incr(getDailyKey(email));

  if (dailyCount === 1) {
    await redisClient.expire(getDailyKey(email), 86400);
  }

  // Cooldown
  await redisClient.setEx(getCooldownKey(email), 60, "WAIT");

  return {
    hourlyCount,
    dailyCount,
  };
};

// ---------- Check Hourly Limit ----------
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

// ---------- Check Daily Limit ----------
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



// ---------- IP Key ----------
const getIpKey = (ip) => `otp:ip:${ip}`;

// ---------- Check IP Limit ----------
exports.checkIpOtpLimit = async (ip) => {
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

// ---------- Increment IP Count ----------
exports.incrementIpOtpRequests = async (ip) => {
  const count = await redisClient.incr(getIpKey(ip));

  if (count === 1) {
    await redisClient.expire(getIpKey(ip), 3600);
  }

  return count;
};
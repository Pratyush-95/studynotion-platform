const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("connect", () => {
  console.log("🟢 Redis Connected");
});

redisClient.on("error", (err) => {
  console.error("🔴 Redis Error:", err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
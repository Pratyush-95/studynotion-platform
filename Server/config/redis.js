const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
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
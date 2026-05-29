const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => console.log("🟢 Redis connected"));
redis.on("error", (e) => console.log("🔴 Redis error:", e.message));

module.exports = redis;

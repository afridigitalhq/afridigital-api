require("dotenv").config();

const redis = require("../memory/redisClient");

function bootstrap() {
  console.log("🧠 AFRAI BOOTSTRAP STARTING...");

  if (!process.env.REDIS_URL) {
    console.log("⚠️ Redis not configured (memory will degrade to ephemeral mode)");
  } else {
    console.log("🟢 Redis mode enabled");
  }

  console.log("⚡ Stream engine ready");
  console.log("🧠 Memory layer ready");
  console.log("🚀 System initialized for Render runtime");
}

module.exports = bootstrap;

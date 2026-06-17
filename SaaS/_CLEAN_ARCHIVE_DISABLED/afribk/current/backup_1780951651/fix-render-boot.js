console.log("🚀 RENDER BOOT");

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.log("⚠️ Redis missing → fallback mode");
} else {
  console.log("✅ Redis configured");
}

// NEVER crash startup
require("./server");

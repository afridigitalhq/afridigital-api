const Redis = require("ioredis");

// In production this becomes Redis Cluster endpoints
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379
});

console.log("\n🔴 V28 REDIS EVENT CLUSTER ONLINE\n");

module.exports = redis;

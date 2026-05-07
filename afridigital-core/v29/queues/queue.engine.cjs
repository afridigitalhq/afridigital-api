const { Queue } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379
};

const queues = {
  ai: new Queue("ai-queue", { connection }),
  ads: new Queue("ads-queue", { connection }),
  jobs: new Queue("jobs-queue", { connection }),
  wallet: new Queue("wallet-queue", { connection }),
  fraud: new Queue("fraud-queue", { connection })
};

console.log("\n📦 QUEUE ENGINE ACTIVE\n");

module.exports = queues;

const Queue = require("bull");

const whatsappQueue = new Queue("whatsapp-messages", {
  redis: process.env.REDIS_URL || null
});

// retry policy
whatsappQueue.on("failed", (job, err) => {
  console.log("❌ Job failed:", job.data, err.message);
});

module.exports = whatsappQueue;

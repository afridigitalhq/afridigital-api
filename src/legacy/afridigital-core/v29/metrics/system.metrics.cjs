console.log("\n📊 METRICS ENGINE ACTIVE\n");

module.exports = {
  uptime: process.uptime(),
  memory: process.memoryUsage()
};

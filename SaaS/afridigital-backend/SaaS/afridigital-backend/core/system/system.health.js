const { assertApiVersion } = require("../runtime/safety/api.guard");
async function getSystemHealth() {
  return {
    backend: 'ONLINE',
    whatsapp: 'ONLINE',
    database: 'ONLINE',
    memory: process.memoryUsage().heapUsed,
    uptime: process.uptime()
  };
}

module.exports = { getSystemHealth };

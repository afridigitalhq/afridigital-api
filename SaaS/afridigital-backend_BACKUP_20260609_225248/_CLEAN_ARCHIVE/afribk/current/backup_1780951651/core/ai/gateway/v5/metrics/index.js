const usage = require('../usage');

function snapshot() {
  return {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    usage: usage.getAll?.() || []
  };
}

module.exports = { snapshot };

const metrics = require('./metrics');

function getHealth() {
  return {
    ok: true,
    service: process.env.RENDER_SERVICE_NAME || 'afridigital-api',
    uptime: metrics.snapshot().uptime,
    redis: !!process.env.REDIS_URL,
    memory: process.memoryUsage(),
    metrics: metrics.snapshot()
  };
}

module.exports = { getHealth };

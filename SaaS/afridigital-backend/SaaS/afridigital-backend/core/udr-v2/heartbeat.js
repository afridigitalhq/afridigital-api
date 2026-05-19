const bus = require('../udr/udr.bus');

console.log('💓 UDR HEARTBEAT SYSTEM ONLINE');

const heartbeat = {
  modules: {},
  lastCheck: Date.now()
};

function pulse(moduleId) {
  heartbeat.modules[moduleId] = Date.now();
  bus.emitEvent('system.heartbeat', { moduleId });
}

function check() {
  const now = Date.now();

  for (const [mod, ts] of Object.entries(heartbeat.modules)) {
    if (now - ts > 15000) {
      console.log(`⚠️ MODULE STALE: ${mod}`);
      bus.emitEvent('system.module.stale', { moduleId: mod });
    }
  }
}

setInterval(check, 5000);

module.exports = { pulse, heartbeat };

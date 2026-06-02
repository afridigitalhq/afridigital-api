const routes = require('./routes');
const observe = require('../observability');
const workers = require('../workers');

const state = {
  ready: false,
  redis: false,
  startedAt: Date.now()
};

async function boot() {
  console.log("🧠 Kernel boot sequence starting...");

  // Phase 1: Observability pre-init
  state.redis = !!process.env.REDIS_URL;

  // Phase 2: Workers (non-blocking)
  workers.start();

  // Phase 3: readiness flip
  state.ready = true;

  console.log("✅ Kernel boot complete");
}

module.exports = {
  boot,
  observe,
  routes,
  state
};

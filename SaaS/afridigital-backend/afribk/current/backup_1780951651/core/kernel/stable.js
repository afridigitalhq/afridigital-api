const kernel = require('./index');
const config = require('./config');

const state = {
  ready: false,
  startedAt: Date.now(),
  whatsapp: false
};

function boot() {
  console.log("🧠 KERNEL STABLE BOOT");

  try {
    state.whatsapp = !!require('../ai/gateway/v5/plugins/whatsapp');
  } catch (e) {
    state.whatsapp = false;
  }

  state.ready = true;
  console.log("🟢 KERNEL STABLE READY");
}

function health() {
  return {
    status: state.ready ? "ok" : "booting",
    kernel: true,
    whatsapp: state.whatsapp,
    uptime: Date.now() - state.startedAt
  };
}

function getConfig(key) {
  try {
    return config.get(key);
  } catch {
    return null;
  }
}

module.exports = {
  boot,
  health,
  getConfig,
  runtime: kernel.runtime,
  registry: kernel.registry,
  resolve: kernel.resolve,
  state
};

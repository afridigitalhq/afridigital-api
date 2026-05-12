const { assertApiVersion } = require("../runtime/safety/api.guard");
const state = {
  processed: 0,
  failed: 0,
  retried: 0,
  dead: 0
};

function inc(key) {
  state[key] = (state[key] || 0) + 1;
}

function get() {
  return {
    status: "ok",
    metrics: state,
    uptime: process.uptime()
  };
}

module.exports = { inc, get };

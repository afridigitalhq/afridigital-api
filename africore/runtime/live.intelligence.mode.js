const bus = require("./event.bus");
const telemetry = require("../telemetry/telemetry.layer");
const memoryBrain = require("../runtime/memory.brain.v1");
const decision = require("./decision.middleware");

let ACTIVE = true;

function enable() {
  ACTIVE = true;
  console.log("🟢 Live Intelligence Mode ENABLED");
}

function disable() {
  ACTIVE = false;
  console.log("🔴 Live Intelligence Mode DISABLED");
}

function isActive() {
  return ACTIVE;
}

// MASTER ENTRY POINT (single pipeline)
async function handle(msg) {
  if (!ACTIVE) return;

  const routing = await decision.handle(msg);
await telemetry.track("live.route", { user: msg.from, route: routing?.decision?.route, confidence: routing?.decision?.confidence });

  bus.emit("live.route", {
    msg,
    routing
  });

  return routing;
}

module.exports = {
  enable,
  disable,
  isActive,
  handle
};

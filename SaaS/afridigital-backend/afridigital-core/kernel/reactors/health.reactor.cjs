const bus = require("../event-bus/bus.cjs");

bus.onEvent("render.health_fail", (s) => {
  console.log("🚨 SERVICE DOWN:", s);
});

bus.onEvent("render.health_ok", (s) => {
  console.log("🟢 HEALTH OK:", s);
});

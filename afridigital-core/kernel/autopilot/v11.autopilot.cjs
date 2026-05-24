const bus = require("../core/context.cjs");

console.log("\n🤖 AUTOPILOT LAYER\n");

if (bus.state.flow !== "stable") {
  console.log("⚠️ RECOVERY ACTIVE");
  bus.state.build = "observed";
} else {
  console.log("✅ IDLE STABLE STATE");
}

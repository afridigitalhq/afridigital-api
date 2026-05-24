const bus = require("./context.cjs");

console.log("\n🔄 STATE FLOW ENGINE ACTIVE\n");

// Phase progression engine
switch (bus.state.build) {
  case "init":
    bus.state.build = "observed";
    console.log("➡️ init → observed");
    break;

  case "observed":
    bus.state.build = "stable";
    console.log("➡️ observed → stable");
    break;

  case "rebuild_requested":
    bus.state.build = "rebuilding";
    console.log("➡️ rebuild requested → rebuilding");
    break;

  default:
    console.log("ℹ️ No state transition needed");
}

module.exports = bus.state;

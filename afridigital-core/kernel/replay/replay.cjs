const bus = require("../../afridigital-core/kernel/event-bus/bus.cjs");

function replay() {
  console.log("\n🔁 EVENT REPLAY ENGINE\n");

  for (const e of bus.queue) {
    console.log(`[REPLAY] ${e.event}`, e.payload);
  }
}

module.exports = replay;

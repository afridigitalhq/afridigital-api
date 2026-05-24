const bus = require("../../afridigital-core/kern../../afridigital-core/kernel/events/bus.cjs");
require("../dispatcher/dispatcher.cjs");
const replay = require("../replay/replay.cjs");

console.log("\n🚀 V12 EVENT MESH BOOT\n");

// SIMULATED PIPELINE ENTRY
bus.emit("MESSAGE_RECEIVED", {
  from: "user",
  text: "Hello AfriDigital"
});

// FINAL SNAPSHOT
setTimeout(() => {
  replay();
  console.log("\n📊 FINAL QUEUE SIZE:", bus.queue.length);
  console.log("\n✅ V12 EVENT MESH ACTIVE\n");
}, 500);

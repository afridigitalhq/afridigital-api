console.log("\n🚀 AFRIDIGITAL V11 EVENT MESH BOOT\n");

const bus = require("../../afridigital-core/kern../../afridigital-core/kernel/events/bus.cjs");
const store = require("../../afridigital-core/kern../../afridigital-core/kernel/events/store.cjs");
const node = require("../mesh/node.cjs");

require("../reactors/ai.reactor.cjs");
require("../reactors/whatsapp.reactor.cjs");
require("../reactors/paystack.reactor.cjs");
require("../reactors/health.reactor.cjs");

console.log("🧠 NODE ACTIVE:", node);

// EVENT REPLAY ENGINE
const history = store.replay();
console.log(`\n📚 REPLAYING ${history.length} EVENTS\n`);

for (const e of history) {
  bus.emitEvent(e.event, e.payload);
}

// BOOT EVENTS
bus.emitEvent("ai.thought_generated", {
  thought: "V11 kernel fully initialized"
});

bus.emitEvent("render.health_ok", {
  service: "frontend"
});

bus.emitEvent("whatsapp.message_received", {
  from: "system",
  text: "boot"
});

bus.emitEvent("paystack.payment_success", {
  user: "demo",
  plan: "pro"
});

console.log("\n✅ V11 EVENT MESH ONLINE\n");

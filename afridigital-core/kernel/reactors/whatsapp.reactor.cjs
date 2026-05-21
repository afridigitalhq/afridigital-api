const bus = require("../../afridigital-core/kern../../afridigital-core/kernel/events/bus.cjs");

bus.onEvent("whatsapp.message_received", (msg) => {
  console.log("💬 WHATSAPP:", msg);

  bus.emitEvent("whatsapp.response_generated", {
    to: msg.from,
    text: "AI: " + msg.text
  });
});

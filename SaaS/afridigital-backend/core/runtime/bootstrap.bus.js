const { bus } = require(./bus/event.bus');

console.log("🚀 AFRIDIGITAL BUS BOOTSTRAP ACTIVE");

// INBOUND → AI
  console.log("📩 INBOUND:", event);

  bus.publish({
    type: "AI_PROCESS",
    payload: event.payload,
    ts: Date.now()
  });
});

// AI → REPLY
bus.subscribe("AI_REPLY", (event) => {
  console.log("🤖 AI_REPLY:", event);

  bus.publish({
    type: "WHATSAPP_SEND",
    payload: event.payload,
    ts: Date.now()
  });
});

// DELIVERY
bus.subscribe("WHATSAPP_SEND", async (event) => {
  console.log("📡 SEND PIPE:", event);
});

bus.publish({
  type: "BOOTSTRAP_CHECK",
  payload: { ok: true },
  ts: Date.now()
});

console.log("✅ BUS PIPELINE ACTIVE");

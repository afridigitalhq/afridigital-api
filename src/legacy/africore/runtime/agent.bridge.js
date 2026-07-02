const bus = require("./event.bus");
const messenger = require("../messenger/whatsapp.client");

// connects swarm output → WhatsApp delivery layer
bus.subscribe("agent.reply", async (payload) => {
  try {
    await messenger.send(payload.to, payload.message);
  } catch (e) {
    console.log("BRIDGE ERROR:", e.message);
  }
});

console.log("🌉 Agent Bridge ACTIVE");

module.exports = {};

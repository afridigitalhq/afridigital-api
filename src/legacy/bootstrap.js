/**
 * 🔥 SYSTEM BOOTSTRAP
 * Connects AI Brain + Realtime + EventBus
 */

const eventbus = require("./eventbus");
const { initRealtime } = require("./realtime");
const { processAI } = require("./ai/brain");

// INIT REALTIME SYSTEM
initRealtime(eventbus);

// TEST EVENT (optional)
eventbus.emit("MARKET_EVENT", {
  type: "website_creation",
  demand: 5
});

console.log("🧠 AFRIDIGITAL CORE SYSTEM ONLINE");
console.log("⚡ AI BRAIN + REALTIME STREAM ACTIVE");

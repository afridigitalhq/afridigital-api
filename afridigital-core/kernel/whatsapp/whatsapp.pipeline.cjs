const bus = require("../events/event.spine.cjs");
const adEngine = require("../ads/ad.engine.cjs");

console.log("\n📡 WHATSAPP AI PIPELINE ACTIVE\n");

function handleMessage(userId, message) {
  bus.emit("CHAT_RECEIVED", { userId, message });

  const response = "AI Response: " + message;

  bus.emit("CHAT_RESPONSE_RENDERED", { userId, response });

  const ad = adEngine.injectAd(userId);

  return { response, ad };
}

module.exports = { handleMessage };

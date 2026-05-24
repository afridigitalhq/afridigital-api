const ai = require("../ai/ai.economy.cjs");

console.log("\n📡 WHATSAPP BOT ENGINE ONLINE\n");

async function handleMessage(userId, text) {

  const response = {
    reply: "AI processed: " + text,
    ad: ai.injectAd()
  };

  ai.rewardUser(userId, "chat_activity");

  return response;
}

module.exports = { handleMessage };

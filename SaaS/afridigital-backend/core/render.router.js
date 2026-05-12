const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS v1.4 RENDER ROUTER
 * Central brain for all message → card decisions
 */

const { tiktokCard, walletCard, adCard } = require("./card.engine");

// 🧠 SIMPLE INTENT CLASSIFIER (v1 lightweight AI logic)
function detectIntent(message = "") {

  const msg = message.toLowerCase();

  if (msg.includes("tiktok") || msg.includes("viral") || msg.includes("creator")) {
    return "TIKTOK";
  }

  if (msg.includes("wallet") || msg.includes("balance") || msg.includes("earn")) {
    return "WALLET";
  }

  if (msg.includes("earn money") || msg.includes("job") || msg.includes("work")) {
    return "AD";
  }

  return "DEFAULT";
}

// 🚀 MAIN ROUTER
function renderResponse(message, context = {}) {

  const intent = detectIntent(message);

  switch (intent) {

    case "TIKTOK":
      return tiktokCard(context.ad || {
        description: "Grow with AI-powered creator strategies",
        url: "https://www.tiktok.com"
      });

    case "WALLET":
      return walletCard(context.balance || 0, context.currency || "USD");

    case "AD":
      return adCard(context.ad || {
        id: "default",
        title: "AfriAI Opportunity",
        description: "Discover earning opportunities powered by AfriOS",
        reward: 10
      });

    default:
      return {
        type: "MESSAGE",
        content: "🤖 AfriAI is processing your request..."
      };
  }
}

module.exports = { renderResponse };

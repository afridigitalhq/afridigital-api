const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AfriOS CTA ENGINE v1.2 STRICT SINGLE EMOJI MODE
 * RULES:
 * - Always starts with 👉
 * - Exactly 1 emoji only
 * - No emoji combinations allowed
 */

function generateCTA(type = "default", brand = "AfriOS") {

  const map = {
    boost: "Start Viral Growth with",
    ads: "Open Growth Campaign:",
    tiktok: "Explore TikTok Boost",
    promotion: "Unlock Promotion:",
    wallet: "View Wallet Dashboard",
    job: "Apply for Opportunity:",
    default: "Open"
  };

  // ✅ SINGLE emoji only (deterministic)
  const emojis = {
    boost: "🚀",
    ads: "📣",
    tiktok: "🎵",
    promotion: "📦",
    wallet: "💰",
    job: "💼",
    default: "🔗"
  };

  const emoji = emojis[type] || emojis.default;
  const text = map[type] || map.default;

  return `👉 ${emoji} ${text} ${brand}`;
}

module.exports = { generateCTA };

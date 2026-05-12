const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🧠 AFRIOS CARD RENDERING ENGINE v1
 * Standardizes all AI + Ads + Job responses
 */

function renderCard(data) {
  return `
━━━━━━━━━━━━━━━━━━
🚀 ${data.title || "AfriAI"}

${data.description || ""}

${data.cta ? "👉 " + data.cta : ""}

${data.url ? "\n🔗 " + data.url : ""}

${data.reward ? "\n💰 Reward: " + data.reward + " points" : ""}

━━━━━━━━━━━━━━━━━━
🤖 Powered by AfriOS
`;
}

/**
 * 🔗 Link Rules Engine
 * - URL present = external open
 * - No URL = stays in WhatsApp chat
 */
function hasExternalLink(data) {
  return !!(data.url && data.url.startsWith("http"));
}

module.exports = {
  renderCard,
  hasExternalLink
};

const { assertApiVersion } = require("../runtime/safety/api.guard");
const brain = require("./brain");

async function routeMessage({ from, text }) {
  const lower = text.toLowerCase();

  if (lower.includes("buy") || lower.includes("payment")) {
    return "🧾 Payment module coming soon.";
  }

  if (lower.includes("love") || lower.includes("date")) {
    return "❤️ AfriLove agent activated.";
  }

  if (lower.includes("help") || lower.includes("support")) {
    return "🛠️ Support team notified.";
  }

  return brain.handle({ from, text });
}

module.exports = { routeMessage };

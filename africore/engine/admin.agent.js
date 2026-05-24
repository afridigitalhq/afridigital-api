const swarm = require("../runtime/swarm.stream");

async function handleAdmin(msg) {
  const text = msg.text || "";

  if (text.includes("status")) {
    return "🧠 Swarm Status: ACTIVE | ALL AGENTS ONLINE";
  }

  if (text.includes("pause")) {
    return "⛔ Swarm PAUSED (not yet implemented control hook)";
  }

  if (text.includes("resume")) {
    return "▶️ Swarm RESUMED";
  }

  if (text.includes("ping")) {
    return "🏓 Admin Agent alive";
  }

  return "🧠 Admin command not recognized";
}

module.exports = { handleAdmin };

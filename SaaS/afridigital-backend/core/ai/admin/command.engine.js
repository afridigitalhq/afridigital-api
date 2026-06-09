const { exec } = require("child_process");
const { broadcast } = global.__AFRISCAN_WS__ || {};

/**
 * 🧠 AFRISCAN ADMIN COMMAND ENGINE
 * Converts WhatsApp text → safe system actions
 */

function parseCommand(text) {
  const t = text.toLowerCase();

  if (t.includes("status")) return { action: "STATUS" };
  if (t.includes("restart backend")) return { action: "RESTART_BACKEND" };
  if (t.includes("health")) return { action: "HEALTH_CHECK" };
  if (t.includes("logs")) return { action: "SHOW_LOGS" };
  if (t.includes("deploy")) return { action: "DEPLOY_SIMULATION" };

  return { action: "UNKNOWN" };
}

async function executeCommand(command) {
  switch (command.action) {

    case "STATUS":
      return {
        ok: true,
        output: "🟢 System running. AFRISCAN active."
      };

    case "HEALTH_CHECK":
      return {
        ok: true,
        output: "🧠 Health: simulated OK (connect real metrics next)"
      };

    case "RESTART_BACKEND":
      exec("pm2 restart all", (err) => {});
      return { ok: true, output: "🔄 Backend restart triggered" };

    case "SHOW_LOGS":
      return { ok: true, output: "📄 Logs endpoint not yet attached" };

    case "DEPLOY_SIMULATION":
      return {
        ok: true,
        output: "🚀 Deployment simulation triggered (no real deploy yet)"
      };

    default:
      return {
        ok: false,
        output: "❌ Command not recognized or not allowed"
      };
  }
}

module.exports = {
  parseCommand,
  executeCommand
};

const fs = require("fs");
const { execSync } = require("child_process");
const { isAdmin } = require("../middleware/afriAuthV2");

function getStatus() {
  const server = execSync("ps aux | grep node | grep server.js || true").toString();
  const kernel = fs.existsSync("africore/kernel/connectivity.kernel.js");

  return `
🧠 AFRI OS v4 DEVOPS STATUS
---------------------------
SERVER:
${server || "not running"}

KERNEL:
${kernel ? "OK" : "MISSING"}

SYSTEM:
ACTIVE
  `;
}

function runAIQuery(text) {
  // placeholder for real AI (OpenAI / local LLM later)
  return `🧠 AI MODE ACTIVE (v4)\nYou said: ${text}`;
}

async function runCommand(req, sendWhatsAppMessage) {
  const from = req.body?.from;
  const textRaw = req.body?.text || "";
  const text = textRaw.trim().toLowerCase();

  if (!isAdmin(req)) {
    return sendWhatsAppMessage(from, "❌ Unauthorized access");
  }

  // ⚡ STATUS
  if (text === "afri status") {
    return sendWhatsAppMessage(from, getStatus());
  }

  // ⚡ PING
  if (text === "afri ping") {
    return sendWhatsAppMessage(from, "🏓 v4 ONLINE");
  }

  // ⚡ KERNEL
  if (text === "afri kernel") {
    const ok = fs.existsSync("africore/kernel/connectivity.kernel.js");
    return sendWhatsAppMessage(from, ok ? "✅ Kernel OK" : "❌ Kernel missing");
  }

  // ⚡ LOGS
  if (text === "afri logs") {
    const logs = execSync("tail -n 20 logs/afri-audit.log || echo 'no logs'").toString();
    return sendWhatsAppMessage(from, logs);
  }

  // ⚡ RESTART
  if (text === "afri restart") {
    execSync("pm2 restart server || node server.js");
    return sendWhatsAppMessage(from, "♻️ Restarted");
  }

  // ⚡ AI MODE (REAL)
  if (text.startsWith("afri ask")) {
    const reply = runAIQuery(textRaw);
    return sendWhatsAppMessage(from, reply);
  }

  return sendWhatsAppMessage(from, "⚠️ Unknown command");
}

module.exports = { runCommand };

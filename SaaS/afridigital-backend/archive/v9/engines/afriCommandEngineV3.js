const fs = require("fs");
const { execSync } = require("child_process");
const { isAdmin } = require("../middleware/afriAuthV2");

function getStatus() {
  const server = execSync("ps aux | grep node | grep server.js || true").toString();
  const kernel = fs.existsSync("africore/kernel/connectivity.kernel.js");

  return `
🚀 AFRI OS v3 STATUS
--------------------
🧠 SERVER:
${server || "not found"}

⚙️ KERNEL:
${kernel ? "OK" : "MISSING"}

📡 SYSTEM: ACTIVE
  `;
}

async function runCommand(req, sendWhatsAppMessage) {
  const from = req.body?.from;
  const text = (req.body?.text || "").trim().toLowerCase();

  if (!isAdmin(req)) {
    return sendWhatsAppMessage(from, "❌ Unauthorized");
  }

  // ⚡ STATUS
  if (text === "afri status") {
    return sendWhatsAppMessage(from, getStatus());
  }

  // ⚡ PING
  if (text === "afri ping") {
    return sendWhatsAppMessage(from, "🏓 Afri OS v3 ONLINE");
  }

  // ⚡ KERNEL
  if (text === "afri kernel") {
    const ok = fs.existsSync("africore/kernel/connectivity.kernel.js");
    return sendWhatsAppMessage(from, ok ? "✅ Kernel OK" : "❌ Kernel missing");
  }

  // ⚡ LOG STREAM
  if (text === "afri logs") {
    const logs = execSync("tail -n 20 logs/afri-audit.log || echo 'no logs'").toString();
    return sendWhatsAppMessage(from, logs);
  }

  // ⚡ RESTART
  if (text === "afri restart") {
    execSync("pm2 restart server || node server.js");
    return sendWhatsAppMessage(from, "♻️ Restart triggered");
  }

  // ⚡ AI MODE (future hook)
  if (text.startsWith("afri ask")) {
    return sendWhatsAppMessage(from, "🧠 AI mode coming next upgrade...");
  }

  return sendWhatsAppMessage(from, "⚠️ Unknown command");
}

module.exports = { runCommand };

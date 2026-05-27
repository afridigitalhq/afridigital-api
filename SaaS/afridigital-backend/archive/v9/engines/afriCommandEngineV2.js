const fs = require("fs");
const { isAdmin } = require("../middleware/afriAuthV2");
const { getStatus } = require("./status.controller");
const { execSync } = require("child_process");

async function runCommand(req, sendWhatsAppMessage) {
  const from = req.body?.from;
  const text = (req.body?.text || "").trim().toLowerCase();

  if (!isAdmin(req)) {
    return sendWhatsAppMessage(from, "❌ Unauthorized admin access.");
  }

  // 📊 STATUS
  if (text === "afri status") {
    return sendWhatsAppMessage(from, getStatus());
  }

  // 🧠 KERNEL CHECK
  if (text === "afri kernel") {
    const exists = fs.existsSync("africore/kernel/connectivity.kernel.js");
    return sendWhatsAppMessage(from, exists ? "✅ Kernel OK" : "❌ Kernel missing");
  }

  // 🔄 RESTART SERVER
  if (text === "afri restart") {
    sendWhatsAppMessage(from, "♻️ Restarting server...");
    execSync("pm2 restart server || node server.js");
    return;
  }

  // 📜 LOGS
  if (text === "afri logs") {
    const logs = execSync("tail -n 20 logs || echo 'No logs found'").toString();
    return sendWhatsAppMessage(from, logs);
  }

  // 🏓 PING
  if (text === "afri ping") {
    return sendWhatsAppMessage(from, "🏓 AfriAI v2 alive");
  }

  return sendWhatsAppMessage(from, "⚠️ Unknown command. Try: afri status");
}

module.exports = { runCommand };

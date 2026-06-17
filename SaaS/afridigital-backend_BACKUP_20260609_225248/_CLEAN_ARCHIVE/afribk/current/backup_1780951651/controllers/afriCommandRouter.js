const { isAdmin } = require("../middleware/afriAuth");
const { getStatus } = require("./status.controller");

async function handleAfriCommand(req, res, sendWhatsAppMessage) {
  const text = req.body?.text?.trim()?.toLowerCase();
  const from = req.body?.from;

  // 🔐 BLOCK NON-ADMINS
  if (!isAdmin(req)) {
    await sendWhatsAppMessage(from, "❌ Unauthorized access.");
    return;
  }

  // ⚙️ COMMANDS
  if (text === "status") {
    const reply = getStatus();
    await sendWhatsAppMessage(from, reply);
    return;
  }

  if (text === "ping") {
    await sendWhatsAppMessage(from, "🏓 AfriAI alive");
    return;
  }

  if (text === "kernel") {
    const fs = require("fs");
    const exists = fs.existsSync("africore/kernel/connectivity.kernel.js");

    await sendWhatsAppMessage(
      from,
      exists ? "✅ Kernel OK" : "❌ Kernel missing"
    );
    return;
  }

  await sendWhatsAppMessage(from, "⚠️ Unknown command");
}

module.exports = { handleAfriCommand };

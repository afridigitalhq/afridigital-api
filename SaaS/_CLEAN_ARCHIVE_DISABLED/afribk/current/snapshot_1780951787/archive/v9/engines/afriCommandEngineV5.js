const fs = require("fs");
const { isAdmin } = require("../middleware/afriAuthV2");
const { simpleAI } = require("../core/ai/afriBrainV5");
const { runTool } = require("../core/ai/toolboxV5");
const { saveMemory, getMemory } = require("../core/memory/afriMemory");

function getSystemSnapshot() {
  return {
    server: fs.existsSync("server.js"),
    kernel: fs.existsSync("africore/kernel/connectivity.kernel.js")
  };
}

async function runCommand(req, sendWhatsAppMessage) {
  const from = req.body?.from;
  const textRaw = req.body?.text || "";
  const text = textRaw.trim().toLowerCase();

  if (!isAdmin(req)) {
    return sendWhatsAppMessage(from, "❌ Unauthorized");
  }

  saveMemory(from, text);

  // ⚡ SYSTEM STATUS
  if (text === "afri status") {
    const snap = getSystemSnapshot();
    return sendWhatsAppMessage(from, JSON.stringify(snap, null, 2));
  }

  // ⚡ TOOL EXECUTION
  if (text.startsWith("afri tool")) {
    const cmd = text.replace("afri tool", "").trim();
    const result = runTool(cmd);
    return sendWhatsAppMessage(from, String(result));
  }

  // ⚡ MEMORY CHECK
  if (text === "afri memory") {
    const mem = getMemory(from);
    return sendWhatsAppMessage(from, JSON.stringify(mem, null, 2));
  }

  // ⚡ AI BRAIN
  if (text.startsWith("afri ask")) {
    const snap = getSystemSnapshot();
    const reply = simpleAI(textRaw, snap);
    return sendWhatsAppMessage(from, reply);
  }

  // ⚡ QUICK COMMANDS
  if (text === "afri ping") return sendWhatsAppMessage(from, "🏓 v5 ONLINE");
  if (text === "afri restart") return sendWhatsAppMessage(from, runTool("restart"));
  if (text === "afri logs") return sendWhatsAppMessage(from, runTool("logs"));
  if (text === "afri kernel") return sendWhatsAppMessage(from, runTool("kernel") ? "OK" : "MISSING");

  return sendWhatsAppMessage(from, "⚠️ Unknown command");
}

module.exports = { runCommand };
